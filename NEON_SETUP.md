# 🚀 Configuration Vercel + Neon pour votre application

## 📋 Vue d'ensemble

Cette documentation vous guide pour connecter votre application à une vraie base de données Neon PostgreSQL via Vercel.

**Actuellement configuré :** System de test avec données mockées
**Objectif :** Remplacer par Neon réel pour la synchronisation cloud

## 🎯 Architecture mise en place

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   IndexedDB     │    │   Next.js API   │    │   Neon Postgres │
│   (Local)       │◄──►│   Routes        │◄──►│   (Cloud)       │
│                 │    │                 │    │                 │
│ • Stockage      │    │ • Sync Service  │    │ • Données       │
│   offline       │    │ • Health check  │    │   partagées     │
│ • Sync queue    │    │ • CRUD ops      │    │ • Multi-device  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Étape 1 : Installation des dépendances

```bash
npm install
```

Les dépendances sont déjà ajoutées dans `package.json` :
- `pg` : Driver PostgreSQL
- `dexie` : IndexedDB pour le stockage local
- `uuid` : Génération d'IDs uniques

## 🔧 Étape 2 : Créer un compte Neon via Vercel

### 2.1 Vercel Dashboard
1. Allez sur [vercel.com](https://vercel.com) et connectez votre projet GitHub
2. Dans votre projet Vercel, allez dans **Storage** → **Create Database**
3. Sélectionnez **Neon** (PostgreSQL)
4. Choisissez votre région (Europe West recommandée)

### 2.2 Configuration automatique
Vercel va automatiquement :
- Créer la base Neon
- Ajouter les variables d'environnement
- Configurer les permissions

## 🔑 Étape 3 : Variables d'environnement

Dans Vercel, les variables suivantes seront automatiquement créées :

```bash
# Automatiquement ajoutées par Vercel + Neon
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
POSTGRES_DATABASE=your_db_name
POSTGRES_HOST=your_host.neon.tech
POSTGRES_PASSWORD=your_password
POSTGRES_PRISMA_URL=your_prisma_url
POSTGRES_URL=your_url
POSTGRES_URL_NON_POOLING=your_non_pooling_url
POSTGRES_USER=your_username
```

## 🗂️ Étape 4 : Initialisation de la base de données

### 4.1 Créer un script d'initialisation

Créez le fichier `/scripts/init-db.js` :

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    // Créer les tables
    await client.query(\`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) CHECK (role IN ('student', 'admin')),
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);
    
    await client.query(\`
      CREATE TABLE IF NOT EXISTS assignments (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        subject VARCHAR(100),
        type VARCHAR(20) CHECK (type IN ('homework', 'report', 'essay', 'study', 'presentation', 'research', 'reading')),
        due_date TIMESTAMP NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);
    
    await client.query(\`
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(20) CHECK (type IN ('course', 'practical', 'exam', 'project', 'sport', 'study')),
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);
    
    // Créer les index pour la performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON assignments(user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);');
    
    console.log('✅ Base de données initialisée avec succès');
  } finally {
    client.release();
  }
}

initDatabase().catch(console.error);
```

### 4.2 Ajouter le script au package.json

```json
{
  "scripts": {
    "init-db": "node scripts/init-db.js"
  }
}
```

## 🔄 Étape 5 : Remplacer les API mockées par Neon

### 5.1 Modifier `/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { NeonStorage } from '@/lib/database/neon';

export async function GET() {
  try {
    const isHealthy = await NeonStorage.healthCheck();
    
    if (isHealthy) {
      return NextResponse.json({ status: 'healthy' });
    } else {
      return NextResponse.json({ status: 'unhealthy' }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed' },
      { status: 503 }
    );
  }
}
```

### 5.2 Activer Neon dans useData.ts

Remplacez les appels `/api/mock-*` par `/api/*` dans le hook `useData.ts`.

## 🧪 Étape 6 : Test du système

### 6.1 Panel de test intégré
- Un bouton **Database** apparaît en bas à droite du Dashboard
- Cliquez pour ouvrir le panel de test
- Testez la création de devoirs et événements
- Observez la synchronisation en temps réel

### 6.2 Fonctionnalités testables
- ✅ **Création** de devoirs et événements
- ✅ **Synchronisation** local ↔ cloud
- ✅ **Mode offline** : fonctionne sans réseau
- ✅ **Auto-sync** quand la connexion revient
- ✅ **Multi-device** : changements visibles partout

## 📊 Étape 7 : Monitoring et optimisation

### 7.1 Console Neon
- Surveillez l'usage dans la console Neon
- Configurez les alertes de quota
- Optimisez les requêtes si nécessaire

### 7.2 Stratégies d'économie
- **Sync intelligent** : seulement les changements
- **Batch operations** : grouper les requêtes
- **Cache local** : IndexedDB comme cache primaire
- **Pull minimal** : sync push-only par défaut

## 🔧 Étape 8 : Customisation

### 8.1 Ajuster la fréquence de sync
Dans `syncService.ts`, ligne ~87 :
```typescript
// Sync toutes les 5 minutes (300000ms)
setInterval(() => {
  if (this.syncStatus.isOnline && !this.syncStatus.syncing) {
    this.syncToCloud();
  }
}, 5 * 60 * 1000); // Ajustez selon vos besoins
```

### 8.2 Configurer la retention locale
Ajoutez une logique de nettoyage des anciennes données locales pour économiser l'espace.

## 🚀 Étape 9 : Déploiement

1. **Push vers GitHub** : `git push origin main`
2. **Deploy automatique** via Vercel
3. **Init DB** : Exécutez `npm run init-db` une fois via Vercel CLI
4. **Test production** : Vérifiez que la sync fonctionne

## 🆘 Dépannage courant

### Erreur de connexion
```bash
Error: connect ECONNREFUSED
```
→ Vérifiez vos variables d'environnement dans Vercel

### Schema manquant
```bash
Error: relation "users" does not exist
```
→ Exécutez le script d'initialisation

### Quota dépassé
→ Surveillez l'usage Neon, optimisez les requêtes

## 🎯 Résultat final

Une fois configuré, vous aurez :
- ✅ **App offline-first** qui fonctionne partout
- ✅ **Sync automatique** entre appareils
- ✅ **Coûts optimisés** avec Neon gratuit
- ✅ **Évolutivité** pour des milliers d'utilisateurs

---

**📝 Note importante :** Le système actuel utilise des données mockées pour les tests. Suivez ce guide pour passer à la vraie base Neon dès que vous êtes prêt !
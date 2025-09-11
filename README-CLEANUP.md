# 🧹 Guide de Nettoyage du Projet Schedule

Ce document explique comment utiliser les scripts de nettoyage automatique pour optimiser votre projet.

## 📋 Scripts Disponibles

### 1. `cleanup-project.js` - Nettoyage des Fichiers
Supprime automatiquement tous les fichiers identifiés comme inutiles :

```bash
node cleanup-project.js
```

**Fichiers supprimés automatiquement :**
- ✅ `src/hooks/useData.old.ts` - Hook obsolète
- ✅ `src/hooks/usePageAnimations.ts` - Animation obsolète
- ✅ `src/lib/animations.ts` - Fichier d'animation obsolète
- ✅ `src/lib/animation-config.ts` - Configuration d'animation obsolète
- ✅ `src/app/devoirs/page_clean.tsx` - Page obsolète
- ✅ `src/lib/database/db.ts` - Base de données obsolète
- ✅ `public/*.svg` - Assets SVG inutilisés (next.svg, vercel.svg, etc.)
- ✅ `out/` - Dossier de build statique complet

### 2. `cleanup-dependencies.js` - Analyse des Dépendances
Analyse toutes les dépendances pour identifier celles qui ne sont pas utilisées :

```bash
node cleanup-dependencies.js
```

**Ce que fait ce script :**
- 🔍 Scanne tous les fichiers source pour les imports
- 📊 Génère un rapport détaillé des dépendances
- 💡 Suggère les commandes npm pour supprimer les dépendances inutiles
- 📄 Sauvegarde un rapport dans `dependency-analysis-report.txt`

## 🚀 Procédure de Nettoyage Recommandée

### Étape 1 : Sauvegarde
```bash
git add .
git commit -m "Sauvegarde avant nettoyage"
```

### Étape 2 : Nettoyage des fichiers
```bash
node cleanup-project.js
```

### Étape 3 : Analyse des dépendances
```bash
node cleanup-dependencies.js
```

### Étape 4 : Vérification
```bash
npm run build
npm run dev
```

### Étape 5 : Suppression des dépendances (si suggéré)
```bash
# Exemple de commandes générées par le script d'analyse
npm uninstall @paralleldrive/cuid2
npm uninstall dexie
```

### Étape 6 : Test final
```bash
npm run build
npm run dev
npm run lint
```

## ⚠️ Fichiers Nécessitant une Révision Manuelle

Ces fichiers ne sont **PAS** supprimés automatiquement et nécessitent votre attention :

### 🔧 Endpoints de Debug/Développement
- `src/app/api/mock-health/route.ts`
- `src/app/api/mock-sync/assignments/route.ts`
- `src/app/api/mock-sync/events/route.ts`
- `src/app/debug/page.tsx`
- `src/app/api/setup-test-data/route.ts`
- `src/app/api/diagnostic/route.ts`

**Action requise :** Déterminez si ces endpoints sont nécessaires en production.

### 📦 Dépendances Potentiellement Inutilisées
- `@paralleldrive/cuid2` - Générateur d'ID unique
- `dexie` - Base de données IndexedDB côté client
- `pg` / `@types/pg` - Driver PostgreSQL (si Neon n'est pas utilisé)

**Action requise :** Vérifiez l'utilisation réelle de ces packages.

## 📊 Économies Attendues

### Fichiers
- **~15-20 fichiers** supprimés immédiatement
- **~10+ fichiers** supprimables après révision manuelle
- **Dossier `out/`** : Plusieurs MB économisés

### Dépendances
- **2-3 packages** potentiellement supprimables
- **Réduction de la taille** de `node_modules`
- **Temps de build** potentiellement amélioré

## 🔄 Maintenance Continue

### Automatiser le nettoyage
Ajoutez à votre workflow :

```json
{
  "scripts": {
    "clean": "node cleanup-project.js",
    "analyze-deps": "node cleanup-dependencies.js",
    "full-cleanup": "npm run clean && npm run analyze-deps"
  }
}
```

### Prévenir l'accumulation de fichiers inutiles
1. Utilisez `.gitignore` mis à jour automatiquement
2. Relancez l'analyse des dépendances mensuellement
3. Vérifiez les nouveaux fichiers avant les commits

## 🆘 En Cas de Problème

### Si l'application ne fonctionne plus après nettoyage :
1. Restaurez depuis Git : `git checkout .`
2. Réinstallez les dépendances : `npm install`
3. Vérifiez les logs d'erreur
4. Réexécutez le nettoyage étape par étape

### Si des dépendances manquent :
```bash
npm install [nom-du-package]
```

## 🎯 Résultat Attendu

Après le nettoyage complet :
- ✅ **Code plus propre** et maintenable
- ✅ **Build plus rapide** 
- ✅ **Moins de confusion** dans le projet
- ✅ **Taille réduite** du repository
- ✅ **Dependencies optimisées**

---

**💡 Conseil :** Exécutez ces scripts régulièrement (par exemple, avant chaque release) pour maintenir un projet propre et optimisé.
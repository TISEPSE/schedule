#!/usr/bin/env node

/**
 * Script de nettoyage automatique du projet Schedule
 * Supprime tous les fichiers inutiles identifiés lors de l'analyse
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Début du nettoyage du projet...\n');

// Liste des fichiers à supprimer (chemins relatifs depuis la racine du projet)
const filesToDelete = [
  // Hooks obsolètes
  'src/hooks/useData.old.ts',
  'src/hooks/usePageAnimations.ts',
  
  // Fichiers d'animation obsolètes
  'src/lib/animations.ts',
  'src/lib/animation-config.ts',
  
  // Pages obsolètes
  'src/app/devoirs/page_clean.tsx',
  
  // Base de données obsolète
  'src/lib/database/db.ts',
  
  // Assets SVG inutilisés
  'public/file.svg',
  'public/globe.svg',
  'public/window.svg',
  'public/vercel.svg',
  'public/next.svg',
];

// Liste des dossiers à supprimer complètement
const foldersToDelete = [
  'out', // Dossier de build statique
];

let deletedFiles = 0;
let deletedFolders = 0;
let errors = 0;

// Fonction pour supprimer un fichier
function deleteFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`✅ Fichier supprimé: ${filePath}`);
      deletedFiles++;
    } else {
      console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Erreur lors de la suppression de ${filePath}:`, error.message);
    errors++;
  }
}

// Fonction pour supprimer un dossier de manière récursive
function deleteFolderRecursive(folderPath) {
  const fullPath = path.join(__dirname, folderPath);
  
  try {
    if (fs.existsSync(fullPath)) {
      // Supprimer récursivement le contenu du dossier
      const files = fs.readdirSync(fullPath);
      
      files.forEach((file) => {
        const currentPath = path.join(fullPath, file);
        const stat = fs.statSync(currentPath);
        
        if (stat.isDirectory()) {
          deleteFolderRecursive(path.relative(__dirname, currentPath));
        } else {
          fs.unlinkSync(currentPath);
        }
      });
      
      fs.rmdirSync(fullPath);
      console.log(`✅ Dossier supprimé: ${folderPath}`);
      deletedFolders++;
    } else {
      console.log(`⚠️  Dossier non trouvé: ${folderPath}`);
    }
  } catch (error) {
    console.log(`❌ Erreur lors de la suppression du dossier ${folderPath}:`, error.message);
    errors++;
  }
}

// Supprimer les fichiers
console.log('📄 Suppression des fichiers inutiles...');
filesToDelete.forEach(deleteFile);

console.log('\n📁 Suppression des dossiers inutiles...');
foldersToDelete.forEach(deleteFolderRecursive);

// Créer/mettre à jour .gitignore
const gitignoreContent = `
# Build outputs
/out/
/.next/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Dependencies
/node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Database
*.db
*.sqlite
*.sqlite3

# Temporary files
*.tmp
*.temp
`;

try {
  const gitignorePath = path.join(__dirname, '.gitignore');
  
  // Lire le .gitignore existant s'il existe
  let existingContent = '';
  if (fs.existsSync(gitignorePath)) {
    existingContent = fs.readFileSync(gitignorePath, 'utf8');
  }
  
  // Ajouter les nouvelles règles si elles n'existent pas déjà
  const linesToAdd = gitignoreContent.trim().split('\n').filter(line => {
    return line.trim() && !line.startsWith('#') && !existingContent.includes(line.trim());
  });
  
  if (linesToAdd.length > 0) {
    const newContent = existingContent + '\n' + linesToAdd.join('\n') + '\n';
    fs.writeFileSync(gitignorePath, newContent);
    console.log('\n✅ Fichier .gitignore mis à jour');
  } else {
    console.log('\n⚠️  .gitignore déjà à jour');
  }
} catch (error) {
  console.log('\n❌ Erreur lors de la mise à jour de .gitignore:', error.message);
  errors++;
}

// Résumé du nettoyage
console.log('\n' + '='.repeat(50));
console.log('📊 RÉSUMÉ DU NETTOYAGE');
console.log('='.repeat(50));
console.log(`✅ Fichiers supprimés: ${deletedFiles}`);
console.log(`✅ Dossiers supprimés: ${deletedFolders}`);
console.log(`❌ Erreurs rencontrées: ${errors}`);

if (errors === 0) {
  console.log('\n🎉 Nettoyage terminé avec succès !');
  console.log('\n📋 PROCHAINES ÉTAPES MANUELLES:');
  console.log('1. Vérifiez si les endpoints de debug sont nécessaires:');
  console.log('   - src/app/api/mock-health/route.ts');
  console.log('   - src/app/api/mock-sync/*/route.ts');
  console.log('   - src/app/debug/page.tsx');
  console.log('2. Vérifiez les dépendances potentiellement inutiles:');
  console.log('   - @paralleldrive/cuid2');
  console.log('   - dexie (si le stockage local n\'est pas utilisé)');
  console.log('3. Lancez `npm run build` pour vérifier que tout fonctionne');
  console.log('4. Lancez `npm run dev` pour tester l\'application');
} else {
  console.log('\n⚠️  Nettoyage terminé avec des erreurs. Vérifiez les messages ci-dessus.');
}

console.log('\n🔄 Pour relancer ce script: node cleanup-project.js');
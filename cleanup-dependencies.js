#!/usr/bin/env node

/**
 * Script pour analyser et nettoyer les dépendances inutilisées
 * Ce script aide à identifier quelles dépendances peuvent être supprimées
 */

const fs = require('fs');
const path = require('path');

console.log('📦 Analyse des dépendances du projet...\n');

// Lire package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Fonction pour rechercher une dépendance dans tous les fichiers
function searchDependencyUsage(depName, searchDir = 'src') {
  const results = [];
  const fullSearchDir = path.join(__dirname, searchDir);
  
  function searchInDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        searchInDirectory(fullPath);
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx'))) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes(depName)) {
            const relativePath = path.relative(__dirname, fullPath);
            results.push(relativePath);
          }
        } catch (error) {
          // Ignorer les erreurs de lecture de fichiers
        }
      }
    }
  }
  
  try {
    searchInDirectory(fullSearchDir);
  } catch (error) {
    console.log(`⚠️  Erreur lors de la recherche dans ${searchDir}`);
  }
  
  return results;
}

// Analyser les dépendances principales
console.log('🔍 Analyse des dépendances principales:');
console.log('='.repeat(50));

const dependencies = packageJson.dependencies || {};
const suspiciousDeps = [];
const unusedDeps = [];
const usedDeps = [];

for (const [depName, version] of Object.entries(dependencies)) {
  const usage = searchDependencyUsage(depName);
  
  if (usage.length === 0) {
    // Vérifier aussi dans les fichiers de config et autres
    const configUsage = [
      ...searchDependencyUsage(depName, '.'),
    ].filter(file => !file.includes('node_modules') && !file.includes('.next'));
    
    if (configUsage.length === 0) {
      unusedDeps.push({ name: depName, version });
      console.log(`❌ ${depName} - Non utilisé`);
    } else {
      suspiciousDeps.push({ name: depName, version, files: configUsage });
      console.log(`⚠️  ${depName} - Utilisé uniquement dans: ${configUsage.join(', ')}`);
    }
  } else {
    usedDeps.push({ name: depName, version, files: usage });
    console.log(`✅ ${depName} - Utilisé dans ${usage.length} fichier(s)`);
  }
}

// Analyser les devDependencies
console.log('\n🔧 Analyse des devDependencies:');
console.log('='.repeat(50));

const devDependencies = packageJson.devDependencies || {};
const unusedDevDeps = [];
const usedDevDeps = [];

for (const [depName, version] of Object.entries(devDependencies)) {
  // Les devDependencies sont souvent utilisées dans la config
  const usage = [
    ...searchDependencyUsage(depName, 'src'),
    ...searchDependencyUsage(depName, '.'),
  ].filter(file => !file.includes('node_modules') && !file.includes('.next'));
  
  // Certaines devDependencies sont implicitement utilisées
  const implicitlyUsed = [
    'typescript', '@types/', 'eslint', 'tailwindcss', 'next'
  ].some(pattern => depName.includes(pattern));
  
  if (usage.length === 0 && !implicitlyUsed) {
    unusedDevDeps.push({ name: depName, version });
    console.log(`❌ ${depName} - Potentiellement non utilisé`);
  } else {
    usedDevDeps.push({ name: depName, version });
    if (usage.length > 0) {
      console.log(`✅ ${depName} - Utilisé`);
    } else {
      console.log(`✅ ${depName} - Utilisé implicitement`);
    }
  }
}

// Générer un rapport détaillé
console.log('\n' + '='.repeat(60));
console.log('📊 RAPPORT DÉTAILLÉ DES DÉPENDANCES');
console.log('='.repeat(60));

console.log(`\n📈 STATISTIQUES:`);
console.log(`   • Dépendances utilisées: ${usedDeps.length}`);
console.log(`   • Dépendances suspectes: ${suspiciousDeps.length}`);
console.log(`   • Dépendances inutilisées: ${unusedDeps.length}`);
console.log(`   • DevDependencies utilisées: ${usedDevDeps.length}`);
console.log(`   • DevDependencies inutilisées: ${unusedDevDeps.length}`);

if (unusedDeps.length > 0) {
  console.log(`\n❌ DÉPENDANCES POTENTIELLEMENT INUTILISÉES:`);
  unusedDeps.forEach(dep => {
    console.log(`   • ${dep.name}@${dep.version}`);
  });
  
  console.log(`\n🗑️  COMMANDE POUR LES SUPPRIMER:`);
  const depsToRemove = unusedDeps.map(dep => dep.name).join(' ');
  console.log(`   npm uninstall ${depsToRemove}`);
}

if (suspiciousDeps.length > 0) {
  console.log(`\n⚠️  DÉPENDANCES À VÉRIFIER MANUELLEMENT:`);
  suspiciousDeps.forEach(dep => {
    console.log(`   • ${dep.name}@${dep.version}`);
    console.log(`     Utilisé dans: ${dep.files.join(', ')}`);
  });
}

if (unusedDevDeps.length > 0) {
  console.log(`\n🔧 DEVDEPENDENCIES POTENTIELLEMENT INUTILISÉES:`);
  unusedDevDeps.forEach(dep => {
    console.log(`   • ${dep.name}@${dep.version}`);
  });
  
  if (unusedDevDeps.length > 0) {
    console.log(`\n🗑️  COMMANDE POUR LES SUPPRIMER:`);
    const devDepsToRemove = unusedDevDeps.map(dep => dep.name).join(' ');
    console.log(`   npm uninstall --save-dev ${devDepsToRemove}`);
  }
}

console.log(`\n💡 RECOMMANDATIONS:`);
console.log(`   1. Vérifiez manuellement les dépendances listées ci-dessus`);
console.log(`   2. Testez l'application après suppression: npm run dev`);
console.log(`   3. Vérifiez que le build fonctionne: npm run build`);
console.log(`   4. Certaines dépendances peuvent être utilisées uniquement en production`);

// Sauvegarder le rapport
const reportPath = path.join(__dirname, 'dependency-analysis-report.txt');
const reportContent = `
RAPPORT D'ANALYSE DES DÉPENDANCES
Généré le: ${new Date().toLocaleString()}

DÉPENDANCES INUTILISÉES (${unusedDeps.length}):
${unusedDeps.map(dep => `- ${dep.name}@${dep.version}`).join('\n')}

DÉPENDANCES SUSPECTES (${suspiciousDeps.length}):
${suspiciousDeps.map(dep => `- ${dep.name}@${dep.version} (utilisé dans: ${dep.files.join(', ')})`).join('\n')}

DEVDEPENDENCIES INUTILISÉES (${unusedDevDeps.length}):
${unusedDevDeps.map(dep => `- ${dep.name}@${dep.version}`).join('\n')}

COMMANDES DE SUPPRESSION:
${unusedDeps.length > 0 ? `npm uninstall ${unusedDeps.map(dep => dep.name).join(' ')}` : 'Aucune dépendance à supprimer'}
${unusedDevDeps.length > 0 ? `npm uninstall --save-dev ${unusedDevDeps.map(dep => dep.name).join(' ')}` : 'Aucune devDependency à supprimer'}
`;

fs.writeFileSync(reportPath, reportContent);
console.log(`\n📄 Rapport sauvegardé dans: dependency-analysis-report.txt`);

console.log('\n✅ Analyse terminée !');
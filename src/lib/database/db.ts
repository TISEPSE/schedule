// FICHIER DÉSACTIVÉ - CAUSAIT DES IMPORTS CÔTÉ CLIENT DE BETTER-SQLITE3
// Le code de base de données est maintenant dans /src/lib/database/server.ts (côté serveur uniquement)

export const db = null;
export const schema = null;
export function initializeDatabase() {
  throw new Error('db.ts est désactivé côté client. Utilise server.ts côté serveur uniquement.');
}
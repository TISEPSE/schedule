// Ancien fichier useData.ts - DÉSACTIVÉ
// Ce fichier causait des imports côté client de better-sqlite3
// Remplacé par useApiData.ts qui utilise les API REST

export function useData() {
  throw new Error('useData est désactivé. Utilise useApiData à la place.');
}
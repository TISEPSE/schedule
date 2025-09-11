// FICHIER DÉSACTIVÉ - CAUSAIT DES IMPORTS CÔTÉ CLIENT DE BETTER-SQLITE3
// Le code de base de données est maintenant dans /src/lib/database/server.ts (côté serveur uniquement)
// Les clients utilisent les API REST

export type { User, Event, Assignment } from '@/types';

export class DatabaseService {
  static async initialize() {
    throw new Error('DatabaseService est désactivé côté client. Utilise les API REST.');
  }
}
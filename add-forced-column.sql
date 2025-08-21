-- Migration pour ajouter la colonne forced_column à la table assignments
-- Exécutez ce script SQL pour mettre à jour votre base de données

ALTER TABLE assignments 
ADD COLUMN forced_column TEXT CHECK(forced_column IN ('todo', 'inProgress', 'review', 'completed'));
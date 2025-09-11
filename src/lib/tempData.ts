// Données temporaires pour la démo
import { School, Class, Student } from '@/types';

// École de démonstration
export const demoSchool: School = {
  id: 'demo-school-1',
  name: 'École de Démonstration',
  address: '123 Rue de l\'Éducation, 75001 Paris',
  phone: '01 23 45 67 89',
  email: 'contact@ecole-demo.fr',
  logo: undefined,
  isSetup: true,
};

// Classes de démonstration
export const demoClasses: Class[] = [
  {
    id: 'class-6a',
    name: '6ème A',
    levelId: 'level-6',
    capacity: 28,
    teacherId: 'teacher-1',
    students: [],
  },
  {
    id: 'class-6b',
    name: '6ème B',
    levelId: 'level-6',
    capacity: 30,
    teacherId: 'teacher-2',
    students: [],
  },
  {
    id: 'class-5a',
    name: '5ème A',
    levelId: 'level-5',
    capacity: 26,
    teacherId: 'teacher-3',
    students: [],
  },
  {
    id: 'class-4a',
    name: '4ème A',
    levelId: 'level-4',
    capacity: 25,
    teacherId: 'teacher-1',
    students: [],
  },
  {
    id: 'class-3a',
    name: '3ème A',
    levelId: 'level-3',
    capacity: 24,
    teacherId: 'teacher-2',
    students: [],
  },
];

// Élèves de démonstration
export const demoStudents: Student[] = [
  {
    id: 'student-1',
    firstName: 'Emma',
    lastName: 'Martin',
    email: 'emma.martin@eleve.fr',
    classId: 'class-6a',
    birthDate: new Date(2008, 3, 15),
    parentContact: 'parents.martin@email.com',
  },
  {
    id: 'student-2',
    firstName: 'Louis',
    lastName: 'Dubois',
    email: 'louis.dubois@eleve.fr',
    classId: 'class-6a',
    birthDate: new Date(2008, 5, 22),
    parentContact: 'parents.dubois@email.com',
  },
  {
    id: 'student-3',
    firstName: 'Chloé',
    lastName: 'Bernard',
    email: 'chloe.bernard@eleve.fr',
    classId: 'class-6b',
    birthDate: new Date(2008, 7, 8),
    parentContact: 'parents.bernard@email.com',
  },
  {
    id: 'student-4',
    firstName: 'Hugo',
    lastName: 'Petit',
    email: 'hugo.petit@eleve.fr',
    classId: 'class-5a',
    birthDate: new Date(2007, 2, 12),
    parentContact: 'parents.petit@email.com',
  },
  {
    id: 'student-5',
    firstName: 'Léa',
    lastName: 'Robert',
    email: 'lea.robert@eleve.fr',
    classId: 'class-4a',
    birthDate: new Date(2006, 10, 30),
    parentContact: 'parents.robert@email.com',
  },
  {
    id: 'student-6',
    firstName: 'Nathan',
    lastName: 'Richard',
    email: 'nathan.richard@eleve.fr',
    classId: 'class-3a',
    birthDate: new Date(2005, 9, 18),
    parentContact: 'parents.richard@email.com',
  },
];

// Ajouter les comptes utilisateurs dans les données temporaires
export const demoUsers = [
  {
    id: 'admin-1',
    email: 'admin@test.fr',
    firstName: 'Admin',
    lastName: 'EduTime',
    role: 'admin' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'test-student-1',
    email: 'test@app.com',
    firstName: 'Utilisateur',
    lastName: 'Test',
    role: 'student' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'personal-1',
    email: 'perso@test.fr',
    firstName: 'Marie',
    lastName: 'Personnel',
    role: 'personal' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Données enrichies des classes avec compteur d'élèves
export const demoClassesWithCount = demoClasses.map(classe => ({
  ...classe,
  studentCount: demoStudents.filter(s => s.classId === classe.id).length
}));
import { demoSchool, demoClasses, demoStudents, demoUsers, demoClassesWithCount } from './tempData';
import { Class, Student } from '@/types';

export interface TempDatabase {
  schools: typeof demoSchool[];
  users: typeof demoUsers;
  classes: typeof demoClasses;
  students: typeof demoStudents;
}

export const tempDb: TempDatabase = {
  schools: [demoSchool],
  users: demoUsers,
  classes: demoClasses,
  students: demoStudents,
};

export class TempDataService {
  static async login(email: string, password: string) {
    const user = tempDb.users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const validPasswords: Record<string, string> = {
      'admin@test.fr': 'admin123',
      'test@app.com': 'test123',
      'teacher@app.com': 'teacher123',
      'perso@test.fr': 'perso123',
    };

    if (validPasswords[email] !== password) {
      throw new Error('Mot de passe incorrect');
    }

    return user;
  }

  static async getSchools() {
    return tempDb.schools;
  }

  static async getClasses() {
    return demoClassesWithCount;
  }

  static async getStudents(schoolId?: string, classId?: string) {
    let students = tempDb.students;
    
    // Ignorer schoolId pour l'instant car les étudiants n'ont pas cette propriété
    
    if (classId) {
      students = students.filter(s => s.classId === classId);
    }
    
    return students;
  }

  static async createClass(classData: {
    name: string;
    levelId: string;
    capacity: number;
    teacherId?: string;
  }) {
    const newClass: Class = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      name: classData.name,
      levelId: classData.levelId,
      capacity: classData.capacity,
      teacherId: classData.teacherId,
      students: [],
    };
    
    tempDb.classes.push(newClass);
    return newClass;
  }

  static async updateClass(id: string, updates: Partial<Class>) {
    const classIndex = tempDb.classes.findIndex(c => c.id === id);
    if (classIndex === -1) {
      throw new Error('Classe non trouvée');
    }
    
    tempDb.classes[classIndex] = {
      ...tempDb.classes[classIndex],
      ...updates,
    };
    
    return tempDb.classes[classIndex];
  }

  static async deleteClass(id: string) {
    const classIndex = tempDb.classes.findIndex(c => c.id === id);
    if (classIndex === -1) {
      throw new Error('Classe non trouvée');
    }
    
    tempDb.classes.splice(classIndex, 1);
    tempDb.students = tempDb.students.filter(s => s.classId !== id);
    return true;
  }

  static async createStudent(studentData: {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: Date;
    parentContact?: string;
    classId: string;
  }) {
    const newStudent: Student = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      email: studentData.email,
      classId: studentData.classId,
      birthDate: studentData.birthDate,
      parentContact: studentData.parentContact,
    };
    
    tempDb.students.push(newStudent);
    return newStudent;
  }

  static async updateStudent(id: string, updates: Partial<Student>) {
    const studentIndex = tempDb.students.findIndex(s => s.id === id);
    if (studentIndex === -1) {
      throw new Error('Élève non trouvé');
    }
    
    tempDb.students[studentIndex] = {
      ...tempDb.students[studentIndex],
      ...updates,
    };
    
    return tempDb.students[studentIndex];
  }

  static async deleteStudent(id: string) {
    const studentIndex = tempDb.students.findIndex(s => s.id === id);
    if (studentIndex === -1) {
      throw new Error('Élève non trouvé');
    }
    
    tempDb.students.splice(studentIndex, 1);
    return true;
  }

  // Méthode supprimée car enrollmentStatus n'existe pas dans le type Student
}
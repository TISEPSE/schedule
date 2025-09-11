export type UserRole = 'admin' | 'student' | 'personal';

// Types de base de données (définis localement pour éviter les imports serveur côté client)
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin' | 'personal';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'course' | 'practical' | 'exam' | 'project' | 'sport' | 'study';
  startTime: Date;
  endTime: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Assignment {
  id: string;
  userId: string;
  title: string;
  description: string;
  subject: string;
  type: 'homework' | 'report' | 'essay' | 'study' | 'presentation' | 'research' | 'reading';
  dueDate: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  isSetup: boolean;
}

export interface Level {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface Class {
  id: string;
  name: string;
  levelId: string;
  teacherId?: string;
  students: Student[];
  capacity: number;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  classId: string;
  birthDate: Date;
  parentContact?: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subjects: string[];
  classes: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  teacherId: string;
}

export interface TimeSlot {
  id: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  startTime: Date;
  endTime: Date;
  room?: string;
  dayOfWeek: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
}
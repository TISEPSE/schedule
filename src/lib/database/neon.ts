import { Pool } from 'pg';

// Configuration Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export interface NeonUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar?: string;
  created_at: Date;
  updated_at: Date;
}

export interface NeonAssignment {
  id: string;
  user_id: string;
  title: string;
  description: string;
  subject: string;
  type: string;
  due_date: Date;
  completed: boolean;
  priority: string;
  created_at: Date;
  updated_at: Date;
}

export interface NeonEvent {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: string;
  start_time: Date;
  end_time: Date;
  location?: string;
  created_at: Date;
  updated_at: Date;
}

export class NeonStorage {
  // Initialize tables
  static async initTables(): Promise<void> {
    const client = await pool.connect();
    try {
      // Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'admin')),
          avatar TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Assignments table
      await client.query(`
        CREATE TABLE IF NOT EXISTS assignments (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          subject VARCHAR(100),
          type VARCHAR(20) NOT NULL CHECK (type IN ('homework', 'report', 'essay', 'study', 'presentation', 'research', 'reading')),
          due_date TIMESTAMP NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Events table
      await client.query(`
        CREATE TABLE IF NOT EXISTS events (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          type VARCHAR(20) NOT NULL CHECK (type IN ('course', 'practical', 'exam', 'project', 'sport', 'study')),
          start_time TIMESTAMP NOT NULL,
          end_time TIMESTAMP NOT NULL,
          location VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Indexes for performance
      await client.query('CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON assignments(user_id);');
      await client.query('CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON assignments(due_date);');
      await client.query('CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);');
      await client.query('CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);');

    } finally {
      client.release();
    }
  }

  // Users
  static async getUser(id: string): Promise<NeonUser | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async getUserByEmail(email: string): Promise<NeonUser | null> {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  static async upsertUser(user: Partial<NeonUser>): Promise<NeonUser> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO users (id, email, first_name, last_name, role, avatar, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          email = EXCLUDED.email,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          role = EXCLUDED.role,
          avatar = EXCLUDED.avatar,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `, [user.id, user.email, user.first_name, user.last_name, user.role, user.avatar]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Assignments
  static async getAssignments(userId: string, lastSync?: Date): Promise<NeonAssignment[]> {
    const client = await pool.connect();
    try {
      let query = 'SELECT * FROM assignments WHERE user_id = $1';
      const params: (string | Date)[] = [userId];
      
      if (lastSync) {
        query += ' AND updated_at > $2';
        params.push(lastSync.toISOString());
      }
      
      const result = await client.query(query + ' ORDER BY due_date', params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async upsertAssignment(assignment: Partial<NeonAssignment>): Promise<NeonAssignment> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO assignments (id, user_id, title, description, subject, type, due_date, completed, priority, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          subject = EXCLUDED.subject,
          type = EXCLUDED.type,
          due_date = EXCLUDED.due_date,
          completed = EXCLUDED.completed,
          priority = EXCLUDED.priority,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `, [
        assignment.id, assignment.user_id, assignment.title, assignment.description,
        assignment.subject, assignment.type, assignment.due_date, assignment.completed, assignment.priority
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async deleteAssignment(id: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM assignments WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }

  // Events
  static async getEvents(userId: string, lastSync?: Date): Promise<NeonEvent[]> {
    const client = await pool.connect();
    try {
      let query = 'SELECT * FROM events WHERE user_id = $1';
      const params: (string | Date)[] = [userId];
      
      if (lastSync) {
        query += ' AND updated_at > $2';
        params.push(lastSync.toISOString());
      }
      
      const result = await client.query(query + ' ORDER BY start_time', params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  static async upsertEvent(event: Partial<NeonEvent>): Promise<NeonEvent> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO events (id, user_id, title, description, type, start_time, end_time, location, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          type = EXCLUDED.type,
          start_time = EXCLUDED.start_time,
          end_time = EXCLUDED.end_time,
          location = EXCLUDED.location,
          updated_at = CURRENT_TIMESTAMP
        RETURNING *;
      `, [
        event.id, event.user_id, event.title, event.description,
        event.type, event.start_time, event.end_time, event.location
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  static async deleteEvent(id: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM events WHERE id = $1', [id]);
    } finally {
      client.release();
    }
  }

  // Health check
  static async healthCheck(): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      return true;
    } catch {
      return false;
    } finally {
      client.release();
    }
  }
}

export default NeonStorage;
import Database from 'better-sqlite3';
import path from 'path';

// 1. Create/Open the Database File
const dbPath = path.join(process.cwd(), 'cryptodata.db');
const db = new Database(dbPath);

// 2. Initialize the Table (if it doesn't exist)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    fullName TEXT,
    phone TEXT,
    country TEXT,
    userId TEXT,
    memberSince TEXT,
    password TEXT
  )
`);

// Interface matches our previous one
export interface UserProfile {
  email: string;
  fullName: string;
  phone: string;
  country: string;
  userId: string;
  memberSince: string;
  password?: string;
}

// --- CRUD OPERATIONS (SQL) ---

export function saveUser(user: UserProfile) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO users (email, fullName, phone, country, userId, memberSince, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(user.email, user.fullName, user.phone, user.country, user.userId, user.memberSince, user.password || null);
  return user;
}

export function findUser(email: string): UserProfile | null {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);
  return user ? (user as UserProfile) : null;
}

export function deleteUser(email: string): boolean {
  const stmt = db.prepare('DELETE FROM users WHERE email = ?');
  const info = stmt.run(email);
  return info.changes > 0;
}

// Helper to get all (for debugging if needed)
export function getUsers(): UserProfile[] {
  const stmt = db.prepare('SELECT * FROM users');
  return stmt.all() as UserProfile[];
}

export function updateUserPassword(email: string, newPassword: string): boolean {
  const stmt = db.prepare('UPDATE users SET password = ? WHERE email = ?');
  const info = stmt.run(newPassword, email);
  return info.changes > 0;
}

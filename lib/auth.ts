import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import { query } from "./db"

export interface User {
  id: string
  email: string
  company_name?: string
  contact_person?: string
  is_admin: boolean
  is_active: boolean
  email_verified: boolean
  access_expires_at?: string
}

export interface Session {
  id: string
  user_id: string
  token: string
  expires_at: string
}

// Passwort hashen
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Passwort verifizieren
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Session erstellen
export async function createSession(userId: string): Promise<string> {
  const token = uuidv4()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 Tage

  await query("INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)", [userId, token, expiresAt])

  return token
}

// Session validieren
export async function validateSession(token: string): Promise<User | null> {
  const result = await query(
    `SELECT u.* FROM users u
     JOIN sessions s ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > NOW()`,
    [token],
  )

  if (result.rows.length === 0) return null
  return result.rows[0]
}

// Session löschen
export async function deleteSession(token: string): Promise<void> {
  await query("DELETE FROM sessions WHERE token = $1", [token])
}

// User erstellen
export async function createUser(
  email: string,
  password: string,
  companyName?: string,
  contactPerson?: string,
  accessExpiresAt?: Date,
): Promise<User> {
  const passwordHash = await hashPassword(password)
  const id = uuidv4()

  const result = await query(
    `INSERT INTO users (id, email, password_hash, company_name, contact_person, access_expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, company_name, contact_person, is_admin, is_active, email_verified, access_expires_at`,
    [id, email, passwordHash, companyName, contactPerson, accessExpiresAt],
  )

  return result.rows[0]
}

// User per E-Mail finden
export async function findUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
  const result = await query("SELECT * FROM users WHERE email = $1", [email])

  if (result.rows.length === 0) return null
  return result.rows[0]
}

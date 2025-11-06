// Client-side storage utility for managing data
// In production, this should be replaced with a database

export interface User {
  id: string
  companyName: string
  contactPerson: string
  passwordHash: string
  registeredAt: string
  expiresAt: string
  isActive: boolean
  isAdmin: boolean
}

export interface InviteToken {
  id: string
  token: string
  createdAt: string
  usedAt: string | null
  usedBy: string | null
}

export interface ExtensionRequest {
  id: string
  userId: string
  companyName: string
  requestedAt: string
  reason: string
  status: "pending" | "approved" | "denied"
  reviewedAt: string | null
  reviewedBy: string | null
}

export interface ActivityLog {
  id: string
  timestamp: string
  type: "login" | "registration" | "invite_created" | "invite_used" | "extension_requested" | "extension_reviewed"
  userId?: string
  details: string
}

// Storage keys
const STORAGE_KEYS = {
  USERS: "portfolio_users",
  INVITES: "portfolio_invites",
  EXTENSIONS: "portfolio_extensions",
  LOGS: "portfolio_logs",
  CURRENT_USER: "portfolio_current_user",
}

// Initialize storage with admin user if empty
export function initializeStorage() {
  if (typeof window === "undefined") return

  const users = getUsers()
  if (users.length === 0) {
    // Create default admin user
    const adminUser: User = {
      id: "admin-1",
      companyName: "Admin",
      contactPerson: "admin",
      passwordHash: "", // Will be set on first login
      registeredAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      isActive: true,
      isAdmin: true,
    }
    saveUsers([adminUser])
  }
}

// Hash password using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Users
export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.USERS)
  return data ? JSON.parse(data) : []
}

export function saveUsers(users: User[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
}

export function getUserByContactPerson(contactPerson: string): User | null {
  const users = getUsers()
  return users.find((u) => u.contactPerson.toLowerCase() === contactPerson.toLowerCase()) || null
}

export function getUserById(id: string): User | null {
  const users = getUsers()
  return users.find((u) => u.id === id) || null
}

export function createUser(user: Omit<User, "id">): User {
  const users = getUsers()
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  }
  users.push(newUser)
  saveUsers(users)
  addLog({
    type: "registration",
    userId: newUser.id,
    details: `Company "${newUser.companyName}" registered`,
  })
  return newUser
}

export function updateUser(id: string, updates: Partial<User>) {
  const users = getUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index !== -1) {
    users[index] = { ...users[index], ...updates }
    saveUsers(users)
  }
}

// Invite Tokens
export function getInvites(): InviteToken[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.INVITES)
  return data ? JSON.parse(data) : []
}

export function saveInvites(invites: InviteToken[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.INVITES, JSON.stringify(invites))
}

export function createInviteToken(): InviteToken {
  const invites = getInvites()
  const token = `invite-${Date.now()}-${Math.random().toString(36).substr(2, 16)}`
  const newInvite: InviteToken = {
    id: `inv-${Date.now()}`,
    token,
    createdAt: new Date().toISOString(),
    usedAt: null,
    usedBy: null,
  }
  invites.push(newInvite)
  saveInvites(invites)
  addLog({
    type: "invite_created",
    details: `Invite token created: ${token}`,
  })
  return newInvite
}

export function getInviteByToken(token: string): InviteToken | null {
  const invites = getInvites()
  return invites.find((i) => i.token === token) || null
}

export function markInviteAsUsed(token: string, userId: string) {
  const invites = getInvites()
  const index = invites.findIndex((i) => i.token === token)
  if (index !== -1) {
    invites[index].usedAt = new Date().toISOString()
    invites[index].usedBy = userId
    saveInvites(invites)
    addLog({
      type: "invite_used",
      userId,
      details: `Invite token used: ${token}`,
    })
  }
}

// Extension Requests
export function getExtensionRequests(): ExtensionRequest[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.EXTENSIONS)
  return data ? JSON.parse(data) : []
}

export function saveExtensionRequests(requests: ExtensionRequest[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.EXTENSIONS, JSON.stringify(requests))
}

export function createExtensionRequest(userId: string, companyName: string, reason: string): ExtensionRequest {
  const requests = getExtensionRequests()
  const newRequest: ExtensionRequest = {
    id: `ext-${Date.now()}`,
    userId,
    companyName,
    requestedAt: new Date().toISOString(),
    reason,
    status: "pending",
    reviewedAt: null,
    reviewedBy: null,
  }
  requests.push(newRequest)
  saveExtensionRequests(requests)
  addLog({
    type: "extension_requested",
    userId,
    details: `Extension requested by ${companyName}`,
  })
  return newRequest
}

export function updateExtensionRequest(id: string, status: "approved" | "denied", reviewedBy: string) {
  const requests = getExtensionRequests()
  const index = requests.findIndex((r) => r.id === id)
  if (index !== -1) {
    requests[index].status = status
    requests[index].reviewedAt = new Date().toISOString()
    requests[index].reviewedBy = reviewedBy
    saveExtensionRequests(requests)

    // If approved, extend user's access by 30 days
    if (status === "approved") {
      const user = getUserById(requests[index].userId)
      if (user) {
        const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        updateUser(user.id, { expiresAt: newExpiresAt, isActive: true })
      }
    }

    addLog({
      type: "extension_reviewed",
      userId: requests[index].userId,
      details: `Extension ${status} for ${requests[index].companyName}`,
    })
  }
}

// Activity Logs
export function getLogs(): ActivityLog[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.LOGS)
  return data ? JSON.parse(data) : []
}

export function saveLogs(logs: ActivityLog[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs))
}

export function addLog(log: Omit<ActivityLog, "id" | "timestamp">) {
  const logs = getLogs()
  const newLog: ActivityLog = {
    ...log,
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
  }
  logs.push(newLog)
  // Keep only last 1000 logs
  if (logs.length > 1000) {
    logs.shift()
  }
  saveLogs(logs)
}

// Current User Session
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  if (!data) return null

  const session = JSON.parse(data)
  // Check if session is expired (24 hours)
  const sessionAge = Date.now() - new Date(session.loginTime).getTime()
  if (sessionAge > 24 * 60 * 60 * 1000) {
    clearCurrentUser()
    return null
  }

  return getUserById(session.userId)
}

export function setCurrentUser(userId: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(
    STORAGE_KEYS.CURRENT_USER,
    JSON.stringify({
      userId,
      loginTime: new Date().toISOString(),
    }),
  )
  addLog({
    type: "login",
    userId,
    details: "User logged in",
  })
}

export function clearCurrentUser() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
}

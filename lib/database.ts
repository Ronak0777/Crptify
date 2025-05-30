import { neon } from "@neondatabase/serverless"

// Check if DATABASE_URL is available
const DATABASE_URL = process.env.DATABASE_URL

let sql: any = null

if (DATABASE_URL) {
  try {
    sql = neon(DATABASE_URL)
  } catch (error) {
    console.warn("Database connection failed:", error)
  }
}

// Mock data for when database is not available
const mockData = {
  users: [
    {
      id: 1,
      email: "admin@cryptoaml.com",
      full_name: "Admin User",
      role: "admin",
      wallet_address: "0x1234...admin",
      kyc_status: "verified",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      email: "compliance@cryptoaml.com",
      full_name: "Compliance Officer",
      role: "compliance",
      wallet_address: "0x5678...comp",
      kyc_status: "verified",
      created_at: new Date().toISOString(),
    },
  ],
  transactions: [
    {
      id: 1,
      tx_id: "0x7a8b9c1d2e3f4g5h",
      from_wallet: "0x1a2b3c4d5e6f7g8h",
      to_wallet: "0x9e8f7g6h5i4j3k2l",
      amount: 15.7,
      currency: "BTC",
      risk_score: 85,
      risk_level: "high",
      flags: ["Mixer", "High Volume"],
      timestamp: "2024-01-15T14:32:18Z",
    },
    {
      id: 2,
      tx_id: "0x4d5e6f7g8h9i0j1k",
      from_wallet: "0x2b3c4d5e6f7g8h9i",
      to_wallet: "0x8f7g6h5i4j3k2l1m",
      amount: 2.3,
      currency: "ETH",
      risk_score: 45,
      risk_level: "medium",
      flags: ["New Wallet"],
      timestamp: "2024-01-15T14:28:45Z",
    },
    {
      id: 3,
      tx_id: "0x1f2g3h4i5j6k7l8m",
      from_wallet: "0x3c4d5e6f7g8h9i0j",
      to_wallet: "0x7g6h5i4j3k2l1m0n",
      amount: 0.8,
      currency: "BTC",
      risk_score: 15,
      risk_level: "low",
      flags: [],
      timestamp: "2024-01-15T14:25:12Z",
    },
  ],
  kycRecords: [
    {
      id: 1,
      user_id: 1,
      wallet_address: "0x1234...admin",
      document_type: "passport",
      document_number: "P123456",
      status: "verified",
      created_at: "2024-01-10T10:00:00Z",
      full_name: "John Doe",
      email: "john@example.com",
    },
    {
      id: 2,
      user_id: 2,
      wallet_address: "0x5678...comp",
      document_type: "license",
      document_number: "DL789012",
      status: "pending",
      created_at: "2024-01-12T15:30:00Z",
      full_name: "Jane Smith",
      email: "jane@example.com",
    },
  ],
  flaggedWallets: [
    {
      id: 1,
      wallet_address: "0x1a2b3c4d5e6f7g8h",
      risk_score: 85,
      risk_level: "high",
      reason: "Connected to known mixer services",
      status: "active",
      created_at: "2024-01-10T10:00:00Z",
    },
    {
      id: 2,
      wallet_address: "0x2b3c4d5e6f7g8h9i",
      risk_score: 45,
      risk_level: "medium",
      reason: "Rapid transaction velocity detected",
      status: "active",
      created_at: "2024-01-11T12:00:00Z",
    },
  ],
}

export interface User {
  id: number
  email: string
  full_name: string
  role: string
  wallet_address?: string
  kyc_status: string
  created_at: string
}

export interface Transaction {
  id: number
  tx_id: string
  from_wallet: string
  to_wallet: string
  amount: number
  currency: string
  risk_score: number
  risk_level: string
  flags: string[]
  timestamp: string
}

export interface KYCRecord {
  id: number
  user_id: number
  wallet_address: string
  document_type: string
  document_number: string
  status: string
  created_at: string
}

export interface FlaggedWallet {
  id: number
  wallet_address: string
  risk_score: number
  risk_level: string
  reason: string
  status: string
  created_at: string
}

export const db = {
  // Users
  async getUsers() {
    if (!sql) return mockData.users
    try {
      return await sql`SELECT * FROM users ORDER BY created_at DESC`
    } catch (error) {
      console.warn("Database query failed, using mock data:", error)
      return mockData.users
    }
  },

  async getUserByEmail(email: string) {
    if (!sql) return mockData.users.find((u) => u.email === email) || null
    try {
      const result = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`
      return result[0] || null
    } catch (error) {
      console.warn("Database query failed, using mock data:", error)
      return mockData.users.find((u) => u.email === email) || null
    }
  },

  async createUser(userData: Partial<User>) {
    if (!sql) {
      const newUser = { id: Date.now(), ...userData, created_at: new Date().toISOString() }
      mockData.users.push(newUser as any)
      return [newUser]
    }
    try {
      return await sql`
        INSERT INTO users (email, password_hash, full_name, role, wallet_address)
        VALUES (${userData.email}, ${userData.password_hash}, ${userData.full_name}, ${userData.role || "user"}, ${userData.wallet_address})
        RETURNING *
      `
    } catch (error) {
      console.warn("Database query failed, using mock data:", error)
      const newUser = { id: Date.now(), ...userData, created_at: new Date().toISOString() }
      mockData.users.push(newUser as any)
      return [newUser]
    }
  },

  // Transactions
  async getTransactions(limit = 50, offset = 0) {
    if (!sql) return mockData.transactions.slice(offset, offset + limit)
    try {
      return await sql`
        SELECT * FROM transactions 
        ORDER BY timestamp DESC 
        LIMIT ${limit} OFFSET ${offset}
      `
    } catch (error) {
      console.warn("Database query failed, using mock data:", error)
      return mockData.transactions.slice(offset, offset + limit)
    }
  },

  async getFlaggedTransactions() {
    if (!sql) return mockData.transactions.filter((t) => t.risk_level === "high" || t.risk_score > 70)
    try {
      return await sql`
        SELECT * FROM transactions 
        WHERE risk_level = 'high' OR risk_score > 70
        ORDER BY timestamp DESC
      `
    } catch (error) {
      console.warn("Database query failed, using mock data:", error)
      return mockData.transactions.filter((t) => t.risk_level === "high" || t.risk_score > 70)
    }
  },

  async createTransaction(txData: Partial<Transaction>) {
    if (!sql) {
      const newTx = { id: Date.now(), ...txData, created_at: new Date().toISOString() }
      mockData.transactions.push(newTx as any)
      return [newTx]
    }
    try {
      return await sql`
        INSERT INTO transactions (tx_id, from_wallet, to_wallet, amount, currency, risk_score, risk_level, flags, timestamp)
        VALUES (${txData.tx_id}, ${txData.from_wallet}, ${txData.to_wallet}, ${txData.amount}, ${txData.currency}, ${txData.risk_score}, ${txData.risk_level}, ${txData.flags}, ${txData.timestamp})
        RETURNING *
      `
    } catch (error) {
      console.warn("Database query failed, using mock data:", error)
      const newTx = { id: Date.now(), ...txData, created_at: new Date().toISOString() }
      mockData.transactions.push(newTx as any)
      return [newTx]
    }
  },

  // KYC Records
  async getKYCRecords() {
    if (!sql) return mockData.kycRecords
    try {
      return await sql`
        SELECT k.*, u.full_name, u.email 
        FROM kyc_records k
        JOIN users u ON k.user_id = u.id
        ORDER BY k.created_at DESC
      `
    } catch (error) {
      console.warn("Database query failed, using mock data:", error)
      return mockData.kycRecords
    }
  },

  async updateKYCStatus(id: number, status: string) {
    if (!sql) {
      const record = mockData.kycRecords.find((r) => r.id === id)
      if (record) record.status = status
      return [record]
    }
    try {
      return await sql`
        UPDATE kyc_records 
        SET status = ${status}, verified_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `
    } catch (error) {
      console.warn("Database query failed, using mock data:", error)
      const record = mockData.kycRecords.find((r) => r.id === id)
      if (record) record.status = status
      return [record]
    }
  },

  // Flagged Wallets
  async getFlaggedWallets() {
    if (!sql) return mockData.flaggedWallets.filter((w) => w.status === "active")
    try {
      return await sql`SELECT * FROM flagged_wallets WHERE status = 'active' ORDER BY risk_score DESC`
    } catch (error) {
      console.warn("Database query failed, using mock data:", error)
      return mockData.flaggedWallets.filter((w) => w.status === "active")
    }
  },

  async flagWallet(walletData: Partial<FlaggedWallet>) {
    if (!sql) {
      const newWallet = { id: Date.now(), ...walletData, created_at: new Date().toISOString() }
      mockData.flaggedWallets.push(newWallet as any)
      return [newWallet]
    }
    try {
      return await sql`
        INSERT INTO flagged_wallets (wallet_address, risk_score, risk_level, reason)
        VALUES (${walletData.wallet_address}, ${walletData.risk_score}, ${walletData.risk_level}, ${walletData.reason})
        RETURNING *
      `
    } catch (error) {
      console.warn("Database query failed, using mock data:", error)
      const newWallet = { id: Date.now(), ...walletData, created_at: new Date().toISOString() }
      mockData.flaggedWallets.push(newWallet as any)
      return [newWallet]
    }
  },

  // Analytics
  async getDashboardStats() {
    if (!sql) {
      return {
        totalTransactions: mockData.transactions.length,
        flaggedTransactions: mockData.transactions.filter((t) => t.risk_level === "high").length,
        highRiskWallets: mockData.flaggedWallets.filter((w) => w.status === "active").length,
        pendingKYC: mockData.kycRecords.filter((k) => k.status === "pending").length,
      }
    }
    try {
      const [totalTransactions] = await sql`SELECT COUNT(*) as count FROM transactions`
      const [flaggedTransactions] = await sql`SELECT COUNT(*) as count FROM transactions WHERE risk_level = 'high'`
      const [highRiskWallets] = await sql`SELECT COUNT(*) as count FROM flagged_wallets WHERE status = 'active'`
      const [pendingKYC] = await sql`SELECT COUNT(*) as count FROM kyc_records WHERE status = 'pending'`

      return {
        totalTransactions: Number.parseInt(totalTransactions.count),
        flaggedTransactions: Number.parseInt(flaggedTransactions.count),
        highRiskWallets: Number.parseInt(highRiskWallets.count),
        pendingKYC: Number.parseInt(pendingKYC.count),
      }
    } catch (error) {
      console.warn("Database query failed, using mock data:", error)
      return {
        totalTransactions: mockData.transactions.length,
        flaggedTransactions: mockData.transactions.filter((t) => t.risk_level === "high").length,
        highRiskWallets: mockData.flaggedWallets.filter((w) => w.status === "active").length,
        pendingKYC: mockData.kycRecords.filter((k) => k.status === "pending").length,
      }
    }
  },
}

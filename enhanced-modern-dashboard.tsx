"use client"

import { useState, useEffect } from "react"
import {
  Shield,
  Wallet,
  Brain,
  Search,
  Filter,
  Download,
  Eye,
  Activity,
  Flag,
  ExternalLink,
  LogOut,
  Users,
  TrendingUp,
  Menu,
  X,
  CheckCircle,
  MessageCircle,
  Mail,
  Phone,
  Sun,
  Moon,
  AlertTriangle,
  BarChart3,
  Settings,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Switch } from "@/components/ui/switch"
import { AuthModal } from "./components/auth-modal"
import { KYCPortal } from "./components/kyc-portal"
import { db } from "./lib/database"

const EnhancedModernDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [dashboardStats, setDashboardStats] = useState({
    totalTransactions: 0,
    flaggedTransactions: 0,
    highRiskWallets: 0,
    pendingKYC: 0,
  })
  const [transactions, setTransactions] = useState([])
  const [flaggedWallets, setFlaggedWallets] = useState([])
  const [walletInput, setWalletInput] = useState("")
  const [riskAnalysis, setRiskAnalysis] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const loadDashboardData = async () => {
    try {
      const [stats, txns, flagged] = await Promise.all([
        db.getDashboardStats(),
        db.getTransactions(20),
        db.getFlaggedWallets(),
      ])

      setDashboardStats(stats)
      setTransactions(txns)
      setFlaggedWallets(flagged)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    }
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await db.getUserByEmail(email)
      if (user) {
        setCurrentUser(user)
        setIsAuthenticated(true)
        setIsAuthModalOpen(false)
        setActiveTab("dashboard")
      } else {
        alert("Invalid credentials. Try admin@cryptoaml.com")
      }
    } catch (error) {
      console.error("Login failed:", error)
      alert("Login failed. Please try again.")
    }
  }

  const handleSignup = async (userData: any) => {
    try {
      const newUser = await db.createUser({
        email: userData.email,
        password_hash: "hashed_password",
        full_name: userData.fullName,
        wallet_address: userData.walletAddress,
      })

      setCurrentUser(newUser[0])
      setIsAuthenticated(true)
      setIsAuthModalOpen(false)
      setActiveTab("dashboard")
    } catch (error) {
      console.error("Signup failed:", error)
      alert("Signup failed. Please try again.")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setActiveTab("dashboard")
  }

  const analyzeWallet = async () => {
    if (!walletInput) return

    const mockAnalysis = {
      address: walletInput,
      riskScore: Math.floor(Math.random() * 100),
      riskLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      flags: ["High Volume", "New Wallet", "Mixer Connection", "Suspicious Pattern", "Rapid Transactions"].slice(
        0,
        Math.floor(Math.random() * 4) + 1,
      ),
      transactionCount: Math.floor(Math.random() * 1000) + 100,
      totalVolume: (Math.random() * 100 + 10).toFixed(2),
      connections: Math.floor(Math.random() * 50) + 5,
      kycStatus: Math.random() > 0.5 ? "verified" : "unverified",
      lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      riskFactors: [
        "Multiple high-value transactions",
        "Connection to known mixer services",
        "Unusual transaction timing patterns",
        "Geographic risk indicators",
      ].slice(0, Math.floor(Math.random() * 3) + 1),
    }

    setRiskAnalysis(mockAnalysis)
  }

  const getRiskColor = (level) => {
    switch (level) {
      case "high":
        return isDarkMode ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return isDarkMode
          ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
          : "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return isDarkMode
          ? "text-green-400 bg-green-500/10 border-green-500/20"
          : "text-green-600 bg-green-50 border-green-200"
      default:
        return isDarkMode
          ? "text-gray-400 bg-gray-500/10 border-gray-500/20"
          : "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const chartData = [
    { name: "Jan", transactions: 4000, flagged: 240, volume: 12000 },
    { name: "Feb", transactions: 3000, flagged: 139, volume: 9800 },
    { name: "Mar", transactions: 2000, flagged: 980, volume: 15600 },
    { name: "Apr", transactions: 2780, flagged: 390, volume: 11200 },
    { name: "May", transactions: 1890, flagged: 480, volume: 8900 },
    { name: "Jun", transactions: 2390, flagged: 380, volume: 13400 },
  ]

  const riskDistributionData = [
    { name: "Low Risk", value: 65, color: "#10B981" },
    { name: "Medium Risk", value: 25, color: "#F59E0B" },
    { name: "High Risk", value: 10, color: "#EF4444" },
  ]

  const riskPatternData = [
    { time: "00:00", risk: 20, volume: 1200 },
    { time: "04:00", risk: 15, volume: 800 },
    { name: "08:00", risk: 45, volume: 3200 },
    { time: "12:00", risk: 80, volume: 5600 },
    { time: "16:00", risk: 65, volume: 4200 },
    { time: "20:00", risk: 35, volume: 2800 },
  ]

  // Credit Card Component
  const CreditCard = ({
    type,
    number,
    holder,
    expiry,
    cvv,
    balance,
    currency = "BTC",
    className = "",
    isMain = false,
  }) => (
    <div className={`relative ${className}`}>
      <div
        className={`
        relative w-full h-48 rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-105
        ${
          type === "primary"
            ? "bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600"
            : type === "secondary"
              ? "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"
              : type === "dark"
                ? "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900"
                : "bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600"
        }
        ${isMain ? "z-20" : "z-10"}
      `}
      >
        {/* Card Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-white/80 text-sm font-medium">Crypto Wallet</div>
            <div className="text-white font-bold text-lg">Cryptify Protected</div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-6 bg-white/20 rounded-md flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div className="w-8 h-6 bg-white/30 rounded-md"></div>
          </div>
        </div>

        {/* Card Number */}
        <div className="mb-4">
          <div className="text-white/80 text-xs mb-1">Wallet Address</div>
          <div className="text-white font-mono text-lg tracking-wider">{number}</div>
        </div>

        {/* Card Footer */}
        <div className="flex justify-between items-end">
          <div>
            <div className="text-white/80 text-xs">Balance</div>
            <div className="text-white font-bold text-xl">
              {balance} {currency}
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/80 text-xs">Risk Score</div>
            <div className="text-white font-bold">{holder}</div>
          </div>
        </div>

        {/* Chip */}
        <div className="absolute top-16 left-6 w-12 h-8 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-lg opacity-90"></div>

        {/* Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="w-full h-full rounded-full border-4 border-white transform translate-x-8 -translate-y-8"></div>
        </div>
      </div>
    </div>
  )

  const renderHeader = () => (
    <header
      className={`${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} shadow-sm border-b sticky top-0 z-50 transition-colors`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Cryptify</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "transactions", label: "Transactions", icon: Activity },
              { id: "risk-engine", label: "Risk Engine", icon: Brain },
              { id: "kyc-portal", label: "KYC Portal", icon: Users },
              { id: "how-it-works", label: "How It Works", icon: Settings },
              { id: "contact", label: "Contact", icon: MessageCircle },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "text-teal-600"
                      : isDarkMode
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Theme Toggle & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Sun className={`h-4 w-4 ${isDarkMode ? "text-gray-400" : "text-yellow-500"}`} />
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                className="data-[state=checked]:bg-teal-600"
              />
              <Moon className={`h-4 w-4 ${isDarkMode ? "text-blue-400" : "text-gray-400"}`} />
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Badge className={`${isDarkMode ? "bg-teal-500/20 text-teal-400" : "bg-teal-100 text-teal-800"}`}>
                  {currentUser?.role || "User"}
                </Badge>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className={isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsAuthModalOpen(true)}
                  className={`${isDarkMode ? "border-teal-500/50 text-teal-400 hover:bg-teal-500/10" : "border-teal-200 text-teal-600 hover:bg-teal-50"}`}
                >
                  Sign In
                </Button>
                <Button onClick={() => setIsAuthModalOpen(true)} className="bg-teal-500 hover:bg-teal-600 text-white">
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-md ${isDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-800" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={`md:hidden py-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
            <div className="space-y-2">
              {[
                { id: "dashboard", label: "Dashboard", icon: BarChart3 },
                { id: "transactions", label: "Transactions", icon: Activity },
                { id: "risk-engine", label: "Risk Engine", icon: Brain },
                { id: "kyc-portal", label: "KYC Portal", icon: Users },
                { id: "how-it-works", label: "How It Works", icon: Settings },
                { id: "contact", label: "Contact", icon: MessageCircle },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex items-center space-x-3 w-full text-left px-3 py-2 text-sm font-medium rounded-md ${
                      isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-gray-800"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                )
              })}

              {/* Mobile Theme Toggle */}
              <div className="flex items-center justify-between px-3 py-2">
                <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Dark Mode
                </span>
                <div className="flex items-center space-x-2">
                  <Sun className={`h-4 w-4 ${isDarkMode ? "text-gray-400" : "text-yellow-500"}`} />
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={setIsDarkMode}
                    className="data-[state=checked]:bg-teal-600"
                  />
                  <Moon className={`h-4 w-4 ${isDarkMode ? "text-blue-400" : "text-gray-400"}`} />
                </div>
              </div>

              <div className="pt-4 space-y-2">
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAuthModalOpen(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full ${isDarkMode ? "border-teal-500/50 text-teal-400 hover:bg-teal-500/10" : "border-teal-200 text-teal-600 hover:bg-teal-50"}`}
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAuthModalOpen(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )

  const renderDashboard = () => (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section with Credit Cards */}
          <section
            className={`relative rounded-3xl overflow-hidden ${isDarkMode ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black" : "bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900"} text-white`}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 lg:p-16">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    Empowering Your <span className="text-teal-300">Crypto Security</span> Future
                  </h1>
                  <p className="text-xl text-teal-100 leading-relaxed">
                    Advanced AI-powered anti-money laundering solutions for cryptocurrency businesses. Protect your
                    platform with real-time threat detection and compliance automation.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-white text-teal-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
                  >
                    Open Account
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
                  >
                    Contact Us
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-8 pt-8">
                  <div>
                    <div className="text-3xl font-bold text-white">
                      {dashboardStats.totalTransactions.toLocaleString()}
                    </div>
                    <div className="text-teal-200">Transactions Monitored</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">{dashboardStats.flaggedTransactions}</div>
                    <div className="text-teal-200">Threats Detected</div>
                  </div>
                </div>
              </div>

              {/* Right Content - Credit Cards Stack */}
              <div className="relative">
                <div className="relative z-10 space-y-4">
                  {/* Main Card */}
                  <CreditCard
                    type="primary"
                    number="0x742d35Cc6634C0532925a3b8D"
                    holder="Low Risk"
                    balance="15.7"
                    currency="BTC"
                    className="transform rotate-6 hover:rotate-3 transition-transform duration-300"
                    isMain={true}
                  />

                  {/* Background Cards */}
                  <CreditCard
                    type="secondary"
                    number="0x8f9e2a1b3c4d5e6f7g8h9i0j"
                    holder="Medium Risk"
                    balance="8.3"
                    currency="ETH"
                    className="absolute top-4 left-4 transform -rotate-6 opacity-80"
                  />

                  <CreditCard
                    type="dark"
                    number="0x1a2b3c4d5e6f7g8h9i0j1k2l"
                    holder="High Risk"
                    balance="2.1"
                    currency="BTC"
                    className="absolute top-8 left-8 transform rotate-12 opacity-60"
                  />
                </div>

                {/* Payment Logos */}
                <div className="mt-8 flex flex-wrap gap-4 justify-center opacity-60">
                  {["Bitcoin", "Ethereum", "Binance", "Coinbase", "Kraken"].map((name) => (
                    <div key={name} className="bg-white/10 rounded-lg px-4 py-2 text-white/60 text-sm">
                      {name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              className={`${isDarkMode ? "bg-gray-800 border-gray-700 hover:border-teal-500/50" : "bg-white border-gray-200 hover:border-teal-500/50"} transition-colors`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Total Transactions
                </CardTitle>
                <Activity className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {dashboardStats.totalTransactions.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card
              className={`${isDarkMode ? "bg-gray-800 border-gray-700 hover:border-red-500/50" : "bg-white border-gray-200 hover:border-red-500/50"} transition-colors`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Flagged Transactions
                </CardTitle>
                <Flag className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {dashboardStats.flaggedTransactions}
                </div>
                <p className="text-xs text-red-500">+2.1% from last month</p>
              </CardContent>
            </Card>

            <Card
              className={`${isDarkMode ? "bg-gray-800 border-gray-700 hover:border-yellow-500/50" : "bg-white border-gray-200 hover:border-yellow-500/50"} transition-colors`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  High-Risk Wallets
                </CardTitle>
                <Wallet className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {dashboardStats.highRiskWallets}
                </div>
                <p className="text-xs text-yellow-600">+5.2% from last month</p>
              </CardContent>
            </Card>

            <Card
              className={`${isDarkMode ? "bg-gray-800 border-gray-700 hover:border-blue-500/50" : "bg-white border-gray-200 hover:border-blue-500/50"} transition-colors`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Pending KYC
                </CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {dashboardStats.pendingKYC}
                </div>
                <p className="text-xs text-green-600">-8.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardHeader>
                <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>
                  Transaction Volume & Risk Trends
                </CardTitle>
                <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  Monthly analysis of transaction patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    transactions: { label: "Transactions", color: "#14B8A6" },
                    flagged: { label: "Flagged", color: "#EF4444" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <XAxis dataKey="name" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                      <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="transactions"
                        stackId="1"
                        stroke="#14B8A6"
                        fill="#14B8A6"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="flagged"
                        stackId="1"
                        stroke="#EF4444"
                        fill="#EF4444"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardHeader>
                <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Risk Distribution</CardTitle>
                <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  Current risk level breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    low: { label: "Low Risk", color: "#10B981" },
                    medium: { label: "Medium Risk", color: "#F59E0B" },
                    high: { label: "High Risk", color: "#EF4444" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {riskDistributionData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>
                    Recent High-Risk Activity
                  </CardTitle>
                  <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                    Latest flagged transactions and wallet activities
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setActiveTab("transactions")}
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 3).map((tx) => (
                  <div
                    key={tx.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${isDarkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gray-50"}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.risk_level === "high"
                            ? "bg-red-100 text-red-600"
                            : tx.risk_level === "medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                        }`}
                      >
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {tx.amount} {tx.currency} Transaction
                        </div>
                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {tx.tx_id} • {new Date(tx.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getRiskColor(tx.risk_level)}>
                        {tx.risk_score}% {tx.risk_level.toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderTransactions = () => (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Transaction Monitoring
              </h1>
              <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Real-time cryptocurrency transaction analysis and risk assessment
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className={isDarkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button
                variant="outline"
                className={isDarkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Transaction Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Today's Volume
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>$2.4M</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Flagged Today
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>23</p>
                  </div>
                  <Flag className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Avg Risk Score
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>34%</p>
                  </div>
                  <Brain className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Processing Time
                    </p>
                    <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>0.23s</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <CardHeader>
              <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>All Transactions</CardTitle>
              <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Comprehensive view of all monitored cryptocurrency transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className={isDarkMode ? "border-gray-700" : "border-gray-200"}>
                    <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Transaction ID</TableHead>
                    <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-600"}>From → To</TableHead>
                    <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Amount</TableHead>
                    <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Risk Score</TableHead>
                    <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Flags</TableHead>
                    <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Date/Time</TableHead>
                    <TableHead className={isDarkMode ? "text-gray-300" : "text-gray-600"}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow
                      key={tx.id}
                      className={`${isDarkMode ? "border-gray-700 hover:bg-gray-700/30" : "border-gray-200 hover:bg-gray-50"}`}
                    >
                      <TableCell className="text-teal-600 font-mono text-sm">{tx.tx_id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className={`${isDarkMode ? "text-gray-300" : "text-gray-900"} font-mono text-xs`}>
                            {tx.from_wallet}
                          </div>
                          <div className={`${isDarkMode ? "text-gray-500" : "text-gray-400"} text-xs`}>↓</div>
                          <div className={`${isDarkMode ? "text-gray-300" : "text-gray-900"} font-mono text-xs`}>
                            {tx.to_wallet}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`${isDarkMode ? "text-white" : "text-gray-900"} font-semibold`}>
                          {tx.amount} {tx.currency}
                        </div>
                        <div className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs`}>
                          ${(tx.amount * 45000).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskColor(tx.risk_level)}>
                          {tx.risk_score}% {tx.risk_level.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {tx.flags?.map((flag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className={`text-xs ${isDarkMode ? "border-red-500/30 text-red-400" : "border-red-300 text-red-600"}`}
                            >
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-sm`}>
                        {new Date(tx.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className={
                              isDarkMode
                                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={
                              isDarkMode
                                ? "border-red-600 text-red-400 hover:bg-red-700/20"
                                : "border-red-300 text-red-600 hover:bg-red-50"
                            }
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderRiskEngine = () => (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              AI-Powered Risk Scoring Engine
            </h1>
            <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"} max-w-3xl mx-auto`}>
              Advanced machine learning algorithms for comprehensive cryptocurrency risk assessment and threat detection
            </p>
          </div>

          {/* Risk Engine Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Wallet Analysis */}
            <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardHeader>
                <CardTitle className={`${isDarkMode ? "text-white" : "text-gray-900"} flex items-center`}>
                  <Brain className="h-5 w-5 mr-2 text-teal-600" />
                  Cryptify Wallet Risk Analysis
                </CardTitle>
                <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  Enter a wallet address for comprehensive AI-powered risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-3">
                  <Input
                    placeholder="Enter wallet address (0x...)"
                    value={walletInput}
                    onChange={(e) => setWalletInput(e.target.value)}
                    className={`${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}
                  />
                  <Button onClick={analyzeWallet} className="bg-teal-500 hover:bg-teal-600 text-white">
                    <Search className="h-4 w-4 mr-2" />
                    Analyze
                  </Button>
                </div>

                {riskAnalysis && (
                  <div
                    className={`mt-6 p-6 rounded-lg border ${isDarkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}`}
                  >
                    <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                      AI Analysis Results
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div
                          className="text-4xl font-bold mb-2"
                          style={{
                            color:
                              riskAnalysis.riskLevel === "high"
                                ? "#EF4444"
                                : riskAnalysis.riskLevel === "medium"
                                  ? "#F59E0B"
                                  : "#10B981",
                          }}
                        >
                          {riskAnalysis.riskScore}%
                        </div>
                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Risk Score</div>
                      </div>
                      <div className="text-center">
                        <Badge className={`${getRiskColor(riskAnalysis.riskLevel)} text-lg px-4 py-2`}>
                          {riskAnalysis.riskLevel.toUpperCase()}
                        </Badge>
                        <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mt-2`}>
                          Risk Level
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                      <div>
                        <div className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {riskAnalysis.transactionCount}
                        </div>
                        <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Transactions</div>
                      </div>
                      <div>
                        <div className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {riskAnalysis.totalVolume} BTC
                        </div>
                        <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Total Volume</div>
                      </div>
                      <div>
                        <div className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {riskAnalysis.connections}
                        </div>
                        <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Connections</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          KYC Status:
                        </label>
                        <Badge
                          className={`ml-2 ${
                            riskAnalysis.kycStatus === "verified"
                              ? isDarkMode
                                ? "bg-green-500/20 text-green-400"
                                : "bg-green-50 text-green-600"
                              : isDarkMode
                                ? "bg-red-500/20 text-red-400"
                                : "bg-red-50 text-red-600"
                          }`}
                        >
                          {riskAnalysis.kycStatus}
                        </Badge>
                      </div>

                      <div>
                        <label className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Last Activity:
                        </label>
                        <span className={`ml-2 text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {new Date(riskAnalysis.lastActivity).toLocaleString()}
                        </span>
                      </div>

                      <div>
                        <label className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Risk Flags:
                        </label>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {riskAnalysis.flags.map((flag, index) => (
                            <Badge
                              key={index}
                              className={`text-xs ${isDarkMode ? "bg-red-500/20 text-red-400" : "bg-red-50 text-red-600 border-red-200"}`}
                            >
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Risk Factors:
                        </label>
                        <ul className="mt-2 space-y-1">
                          {riskAnalysis.riskFactors.map((factor, index) => (
                            <li
                              key={index}
                              className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"} flex items-center`}
                            >
                              <AlertTriangle className="h-3 w-3 text-yellow-500 mr-2" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-6">
                      <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                        <Flag className="h-3 w-3 mr-1" />
                        Flag Wallet
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={isDarkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={isDarkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-700"}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export Report
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Risk Patterns Chart */}
            <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <CardHeader>
                <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Risk Pattern Analysis</CardTitle>
                <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                  24-hour risk distribution patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    risk: { label: "Risk Level", color: "#EF4444" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskPatternData}>
                      <XAxis dataKey="time" stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                      <YAxis stroke={isDarkMode ? "#9CA3AF" : "#6B7280"} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="risk" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* AI Model Performance */}
          <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <CardHeader>
              <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>
                AI Model Performance Metrics
              </CardTitle>
              <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Real-time performance of our machine learning models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">94.7%</div>
                  <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Accuracy</div>
                  <div className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"} mt-1`}>
                    Detection accuracy rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">91.2%</div>
                  <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Precision</div>
                  <div className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"} mt-1`}>
                    True positive rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">89.8%</div>
                  <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Recall</div>
                  <div className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"} mt-1`}>
                    Sensitivity measure
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500">0.23s</div>
                  <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Avg Response</div>
                  <div className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"} mt-1`}>
                    Processing time
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Scoring Methodology */}
          <Card className={`${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <CardHeader>
              <CardTitle className={isDarkMode ? "text-white" : "text-gray-900"}>Risk Scoring Methodology</CardTitle>
              <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Understanding how our AI algorithms assess cryptocurrency transaction risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-3`}>
                    Transaction Analysis
                  </h3>
                  <ul className={`space-y-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <li>• Volume patterns</li>
                    <li>• Frequency analysis</li>
                    <li>• Time-based clustering</li>
                    <li>• Geographic indicators</li>
                  </ul>
                </div>
                <div className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-3`}>
                    Network Analysis
                  </h3>
                  <ul className={`space-y-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <li>• Wallet connections</li>
                    <li>• Known entity mapping</li>
                    <li>• Mixer detection</li>
                    <li>• Exchange relationships</li>
                  </ul>
                </div>
                <div className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
                  <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-3`}>
                    Behavioral Scoring
                  </h3>
                  <ul className={`space-y-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <li>• Historical patterns</li>
                    <li>• Anomaly detection</li>
                    <li>• Risk escalation</li>
                    <li>• Compliance scoring</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderKYCPortal = () => (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KYCPortal />
      </div>
    </div>
  )

  const renderHowItWorks = () => (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16">
          <h2 className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            How We Help You Succeed
          </h2>
          <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"} max-w-3xl mx-auto`}>
            Our streamlined process ensures quick setup and immediate protection for your crypto business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <Card
            className={`text-center p-8 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-2xl font-bold text-teal-600">1</div>
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
              Getting Started
            </h3>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              A simple step-by-step setup guide to get your AML monitoring system up and running in minutes.
            </p>
          </Card>

          {/* Step 2 */}
          <Card
            className={`text-center p-8 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-2xl font-bold text-teal-600">2</div>
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
              Your Journey
            </h3>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              A comprehensive guide that helps you understand and navigate your compliance journey with confidence.
            </p>
          </Card>

          {/* Step 3 */}
          <Card
            className={`text-center p-8 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-2xl font-bold text-teal-600">3</div>
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
              Simplify Compliance
            </h3>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              A straightforward approach to managing your compliance requirements with automated reporting and alerts.
            </p>
          </Card>

          {/* Step 4 */}
          <Card
            className={`text-center p-8 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>You Succeed</h3>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              A comprehensive suite that helps you achieve your compliance goals while focusing on growing your
              business.
            </p>
          </Card>

          {/* Step 5 */}
          <Card
            className={`text-center p-8 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
              Sign-Up to Success
            </h3>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              A streamlined onboarding process that gets you from sign-up to full compliance protection in record time.
            </p>
          </Card>

          {/* Step 6 */}
          <Card
            className={`text-center p-8 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
              Ongoing Protection
            </h3>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Continuous monitoring and updates ensure your compliance strategy evolves with changing regulations.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderContact = () => (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 mb-16">
          <h2 className={`text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Contact Us</h2>
          <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"} max-w-3xl mx-auto`}>
            Get in touch with our team for personalized support and consultation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <Card className={`p-8 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"} mb-6`}>
              Send us a message
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    First Name
                  </label>
                  <Input
                    className={isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                    Last Name
                  </label>
                  <Input
                    className={isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Email
                </label>
                <Input
                  type="email"
                  className={isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Company
                </label>
                <Input className={isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"} />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>
                  Message
                </label>
                <textarea
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                  }`}
                  placeholder="Tell us about your compliance needs..."
                />
              </div>
              <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Send Message</Button>
            </div>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className={`p-6 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Email Us</h3>
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>support@cryptoaml.com</p>
                </div>
              </div>
            </Card>

            <Card className={`p-6 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Call Us</h3>
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>+1 (555) 123-4567</p>
                </div>
              </div>
            </Card>

            <Card className={`p-6 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Live Chat</h3>
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Available 24/7</p>
                </div>
              </div>
            </Card>

            <div
              className={`p-6 rounded-lg ${isDarkMode ? "bg-gradient-to-br from-teal-900/50 to-blue-900/50" : "bg-gradient-to-br from-teal-50 to-blue-50"}`}
            >
              <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"} mb-4`}>
                Need immediate assistance?
              </h3>
              <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} mb-4`}>
                Our compliance experts are available to help you with urgent matters and provide immediate guidance.
              </p>
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">Schedule a Call</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "transactions":
        return renderTransactions()
      case "risk-engine":
        return renderRiskEngine()
      case "kyc-portal":
        return renderKYCPortal()
      case "how-it-works":
        return renderHowItWorks()
      case "contact":
        return renderContact()
      default:
        return renderDashboard()
    }
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} transition-colors`}
    >
      {renderHeader()}
      <main>{renderContent()}</main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </div>
  )
}

export default EnhancedModernDashboard

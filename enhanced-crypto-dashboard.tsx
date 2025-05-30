"use client"

import { useState, useEffect } from "react"
import {
  Shield,
  User,
  BarChart3,
  AlertTriangle,
  Wallet,
  Brain,
  FileText,
  Gavel,
  Search,
  Filter,
  Download,
  Eye,
  Activity,
  Flag,
  ExternalLink,
  Bell,
  LogOut,
  Settings,
  Users,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { AuthModal } from "./components/auth-modal"
import { KYCPortal } from "./components/kyc-portal"
import { db } from "./lib/database"

const EnhancedDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
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
      // Simulate authentication
      const user = await db.getUserByEmail(email)
      if (user) {
        setCurrentUser(user)
        setIsAuthenticated(true)
        setIsAuthModalOpen(false)
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
      // Create user and KYC record
      const newUser = await db.createUser({
        email: userData.email,
        password_hash: "hashed_password", // In real app, hash the password
        full_name: userData.fullName,
        wallet_address: userData.walletAddress,
      })

      setCurrentUser(newUser[0])
      setIsAuthenticated(true)
      setIsAuthModalOpen(false)
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

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "transactions", label: "All Transactions", icon: Activity },
    { id: "flagged", label: "Flagged Wallets", icon: AlertTriangle },
    { id: "risk-engine", label: "Risk Scoring Engine", icon: Brain },
    { id: "kyc", label: "KYC Portal", icon: Users },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "law-enforcement", label: "Law Enforcement Access", icon: Gavel },
  ]

  const getRiskColor = (level) => {
    switch (level) {
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "low":
        return "text-green-400 bg-green-500/10 border-green-500/20"
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20"
    }
  }

  const analyzeWallet = async () => {
    if (!walletInput) return

    // Simulate AI risk analysis
    const mockAnalysis = {
      address: walletInput,
      riskScore: Math.floor(Math.random() * 100),
      riskLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      flags: ["High Volume", "New Wallet", "Mixer Connection"].slice(0, Math.floor(Math.random() * 3) + 1),
      transactionCount: Math.floor(Math.random() * 1000),
      totalVolume: (Math.random() * 100).toFixed(2),
      connections: Math.floor(Math.random() * 50),
      kycStatus: Math.random() > 0.5 ? "verified" : "unverified",
    }

    setRiskAnalysis(mockAnalysis)
  }

  const chartData = [
    { name: "Jan", transactions: 4000, flagged: 240, volume: 12000 },
    { name: "Feb", transactions: 3000, flagged: 139, volume: 9800 },
    { name: "Mar", transactions: 2000, flagged: 980, volume: 15600 },
    { name: "Apr", transactions: 2780, flagged: 390, volume: 11200 },
    { name: "May", transactions: 1890, flagged: 480, volume: 8900 },
    { name: "Jun", transactions: 2390, flagged: 380, volume: 13400 },
  ]

  const riskPatternData = [
    { time: "00:00", risk: 20, volume: 1200 },
    { time: "04:00", risk: 15, volume: 800 },
    { time: "08:00", risk: 45, volume: 3200 },
    { time: "12:00", risk: 80, volume: 5600 },
    { time: "16:00", risk: 65, volume: 4200 },
    { time: "20:00", risk: 35, volume: 2800 },
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Hero Section with Background Image */}
      <div
        className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/crypto-chip.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">AI-Powered Crypto AML Monitoring</h1>
          <p className="text-gray-300 text-lg">Protecting the crypto economy with advanced threat detection</p>
          <div className="flex space-x-4 mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Brain className="h-4 w-4 mr-2" />
              Run AI Analysis
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboardStats.totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-green-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 hover:border-red-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Flagged Transactions</CardTitle>
            <Flag className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboardStats.flaggedTransactions}</div>
            <p className="text-xs text-red-400">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 hover:border-yellow-500/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">High-Risk Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboardStats.highRiskWallets}</div>
            <p className="text-xs text-yellow-400">+5.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-300">Pending KYC</CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{dashboardStats.pendingKYC}</div>
            <p className="text-xs text-green-400">-8.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Transaction Volume & Risk Trends</CardTitle>
            <CardDescription className="text-gray-400">Monthly analysis of transaction patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                transactions: { label: "Transactions", color: "#3B82F6" },
                flagged: { label: "Flagged", color: "#EF4444" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="transactions"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
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

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Risk Distribution by Hour</CardTitle>
            <CardDescription className="text-gray-400">24-hour risk pattern analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                risk: { label: "Risk Level", color: "#EF4444" },
                volume: { label: "Volume", color: "#10B981" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskPatternData}>
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="risk" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions with Enhanced Features */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Recent High-Risk Transactions</CardTitle>
              <CardDescription className="text-gray-400">
                Latest cryptocurrency transactions flagged by AI analysis
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Tx ID</TableHead>
                <TableHead className="text-gray-300">From → To</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Risk Score</TableHead>
                <TableHead className="text-gray-300">Flags</TableHead>
                <TableHead className="text-gray-300">Date/Time</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.slice(0, 5).map((tx) => (
                <TableRow key={tx.id} className="border-gray-700 hover:bg-gray-700/30">
                  <TableCell className="text-blue-400 font-mono text-sm">{tx.tx_id}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-gray-300 font-mono text-xs">{tx.from_wallet}</div>
                      <div className="text-gray-500 text-xs">↓</div>
                      <div className="text-gray-300 font-mono text-xs">{tx.to_wallet}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-white font-semibold">
                      {tx.amount} {tx.currency}
                    </div>
                    <div className="text-gray-400 text-xs">${(tx.amount * 45000).toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(tx.risk_level)}>
                      {tx.risk_score}% {tx.risk_level.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {tx.flags?.map((flag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-red-500/30 text-red-400">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300 text-sm">{new Date(tx.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-700/20">
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
  )

  const renderRiskEngine = () => (
    <div className="space-y-6">
      {/* AI Risk Engine Header */}
      <div
        className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/crypto-flow.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">AI-Powered Risk Scoring Engine</h2>
          <p className="text-gray-300 text-lg">Advanced machine learning algorithms for crypto threat detection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallet Analysis */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-400" />
              Wallet Risk Analysis
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter a wallet address for comprehensive AI-powered risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-3">
              <Input
                placeholder="Enter wallet address (0x...)"
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Button onClick={analyzeWallet} className="bg-blue-600 hover:bg-blue-700">
                <Search className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </div>

            {riskAnalysis && (
              <div className="mt-6 p-6 bg-gray-700/50 rounded-lg border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">AI Analysis Results</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div
                      className="text-3xl font-bold mb-1"
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
                    <div className="text-sm text-gray-400">Risk Score</div>
                  </div>
                  <div className="text-center">
                    <Badge className={getRiskColor(riskAnalysis.riskLevel)} size="lg">
                      {riskAnalysis.riskLevel.toUpperCase()}
                    </Badge>
                    <div className="text-sm text-gray-400 mt-1">Risk Level</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-white">{riskAnalysis.transactionCount}</div>
                    <div className="text-xs text-gray-400">Transactions</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{riskAnalysis.totalVolume} BTC</div>
                    <div className="text-xs text-gray-400">Total Volume</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{riskAnalysis.connections}</div>
                    <div className="text-xs text-gray-400">Connections</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">KYC Status:</label>
                    <Badge
                      className={
                        riskAnalysis.kycStatus === "verified"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }
                    >
                      {riskAnalysis.kycStatus}
                    </Badge>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Risk Flags:</label>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {riskAnalysis.flags.map((flag, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <Flag className="h-3 w-3 mr-1" />
                    Flag Wallet
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk Patterns Chart */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Risk Pattern Analysis</CardTitle>
            <CardDescription className="text-gray-400">24-hour risk distribution patterns</CardDescription>
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
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="risk" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Model Performance */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">AI Model Performance Metrics</CardTitle>
          <CardDescription className="text-gray-400">
            Real-time performance of our machine learning models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">94.7%</div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">91.2%</div>
              <div className="text-sm text-gray-400">Precision</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">89.8%</div>
              <div className="text-sm text-gray-400">Recall</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">0.23s</div>
              <div className="text-sm text-gray-400">Avg Response</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "kyc":
        return <KYCPortal />
      case "risk-engine":
        return renderRiskEngine()
      case "flagged":
      case "transactions":
      case "reports":
      case "law-enforcement":
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400 text-lg">
              {menuItems.find((item) => item.id === activeTab)?.label} - Coming Soon
            </p>
          </div>
        )
      default:
        return renderDashboard()
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white">
        {/* Landing Page */}
        <div
          className="relative min-h-screen flex items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url('/images/aml-compliance.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="text-center space-y-6 max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Shield className="h-16 w-16 text-blue-400" />
              <h1 className="text-5xl font-bold">CryptoAML Shield</h1>
            </div>
            <p className="text-2xl text-gray-300 mb-8">AI-powered firewall for crypto crime</p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Advanced machine learning algorithms detect suspicious cryptocurrency transactions, ensuring compliance
              with anti-money laundering regulations and protecting the digital economy.
            </p>
            <div className="flex space-x-4 justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 text-lg px-8 py-3"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Top Navigation */}
      <header className="bg-gray-900/50 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">CryptoAML Shield</span>
            </div>
            <div className="hidden md:block text-gray-400 text-sm">AI-powered firewall for crypto crime</div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">{currentUser?.role || "User"}</Badge>
            <Button variant="ghost" size="sm" className="text-gray-300">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className="w-64 bg-gray-900/30 border-r border-gray-700 min-h-[calc(100vh-73px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                        activeTab === item.id
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* User Info in Sidebar */}
            <div className="mt-8 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{currentUser?.full_name || "User"}</div>
                  <div className="text-xs text-gray-400">{currentUser?.email}</div>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}

export default EnhancedDashboard

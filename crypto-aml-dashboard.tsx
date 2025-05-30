"use client"

import { useState } from "react"
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
  Send,
  Eye,
  Activity,
  Flag,
  ChevronDown,
  ExternalLink,
  Bell,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis } from "recharts"

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [walletInput, setWalletInput] = useState("")
  const [riskAnalysis, setRiskAnalysis] = useState(null)

  // Sample data
  const summaryData = {
    totalTransactions: 1247893,
    flaggedTransactions: 342,
    highRiskWallets: 89,
    casesReported: 23,
  }

  const recentTransactions = [
    {
      id: "0x7a8b9c...",
      from: "0x1a2b3c4d...",
      to: "0x9e8f7g6h...",
      amount: "15.7 BTC",
      riskScore: 85,
      riskLevel: "high",
      timestamp: "2024-01-15 14:32:18",
      flags: ["Mixer", "High Volume"],
    },
    {
      id: "0x4d5e6f...",
      from: "0x2b3c4d5e...",
      to: "0x8f7g6h5i...",
      amount: "2.3 ETH",
      riskScore: 45,
      riskLevel: "medium",
      timestamp: "2024-01-15 14:28:45",
      flags: ["New Wallet"],
    },
    {
      id: "0x1f2g3h...",
      from: "0x3c4d5e6f...",
      to: "0x7g6h5i4j...",
      amount: "0.8 BTC",
      riskScore: 15,
      riskLevel: "low",
      timestamp: "2024-01-15 14:25:12",
      flags: [],
    },
  ]

  const flaggedTransactions = [
    {
      id: "0x7a8b9c...",
      amount: "15.7 BTC",
      riskScore: 85,
      reason: "Transaction through known mixer service with high anonymity features",
      walletHistory: "Connected to 15 suspicious addresses",
      timestamp: "2024-01-15 14:32:18",
    },
    {
      id: "0x9d8e7f...",
      amount: "45.2 ETH",
      riskScore: 92,
      reason: "Rapid succession of transactions exceeding velocity thresholds",
      walletHistory: "New wallet with immediate high-value activity",
      timestamp: "2024-01-15 13:45:22",
    },
  ]

  const chartData = [
    { name: "Jan", transactions: 4000, flagged: 240 },
    { name: "Feb", transactions: 3000, flagged: 139 },
    { name: "Mar", transactions: 2000, flagged: 980 },
    { name: "Apr", transactions: 2780, flagged: 390 },
    { name: "May", transactions: 1890, flagged: 480 },
    { name: "Jun", transactions: 2390, flagged: 380 },
  ]

  const riskPatternData = [
    { time: "00:00", risk: 20 },
    { time: "04:00", risk: 15 },
    { time: "08:00", risk: 45 },
    { time: "12:00", risk: 80 },
    { time: "16:00", risk: 65 },
    { time: "20:00", risk: 35 },
  ]

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "transactions", label: "All Transactions", icon: Activity },
    { id: "flagged", label: "Flagged Wallets", icon: AlertTriangle },
    { id: "risk-engine", label: "Risk Scoring Engine", icon: Brain },
    { id: "kyc", label: "KYC Portal", icon: User },
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

  const analyzeWallet = () => {
    if (!walletInput) return

    // Simulate analysis
    const mockAnalysis = {
      address: walletInput,
      riskScore: Math.floor(Math.random() * 100),
      riskLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      flags: ["High Volume", "New Wallet", "Mixer Connection"].slice(0, Math.floor(Math.random() * 3) + 1),
      transactionCount: Math.floor(Math.random() * 1000),
      totalVolume: (Math.random() * 100).toFixed(2),
    }

    setRiskAnalysis(mockAnalysis)
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{summaryData.totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-green-400">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Flagged Transactions</CardTitle>
            <Flag className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{summaryData.flaggedTransactions}</div>
            <p className="text-xs text-red-400">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">High-Risk Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{summaryData.highRiskWallets}</div>
            <p className="text-xs text-yellow-400">+5.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Cases Reported</CardTitle>
            <FileText className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{summaryData.casesReported}</div>
            <p className="text-xs text-green-400">+8.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
          <CardDescription className="text-gray-400">
            Latest cryptocurrency transactions with risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Tx ID</TableHead>
                <TableHead className="text-gray-300">From Wallet</TableHead>
                <TableHead className="text-gray-300">To Wallet</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Risk Score</TableHead>
                <TableHead className="text-gray-300">Date/Time</TableHead>
                <TableHead className="text-gray-300">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((tx) => (
                <TableRow key={tx.id} className="border-gray-700 hover:bg-gray-700/30">
                  <TableCell className="text-blue-400 font-mono">{tx.id}</TableCell>
                  <TableCell className="text-gray-300 font-mono">{tx.from}</TableCell>
                  <TableCell className="text-gray-300 font-mono">{tx.to}</TableCell>
                  <TableCell className="text-white font-semibold">{tx.amount}</TableCell>
                  <TableCell>
                    <Badge className={getRiskColor(tx.riskLevel)}>
                      {tx.riskScore}% {tx.riskLevel.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{tx.timestamp}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">Transaction Details</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Detailed analysis of transaction {tx.id}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-300">Risk Flags:</label>
                            <div className="flex gap-2 mt-1">
                              {tx.flags.map((flag, index) => (
                                <Badge key={index} variant="destructive">
                                  {flag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-300">Risk Assessment:</label>
                            <p className="text-gray-400 mt-1">
                              This transaction shows patterns consistent with money laundering activities.
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Transaction Volume & Risk Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              transactions: {
                label: "Transactions",
                color: "#3B82F6",
              },
              flagged: {
                label: "Flagged",
                color: "#EF4444",
              },
            }}
            className="h-[300px]"
          >
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
              <Area type="monotone" dataKey="flagged" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )

  const renderFlaggedTransactions = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Flagged Transactions</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {flaggedTransactions.map((tx, index) => (
        <Collapsible key={tx.id}>
          <Card className="bg-red-500/10 border-red-500/30">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-red-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div>
                      <CardTitle className="text-white">{tx.id}</CardTitle>
                      <CardDescription className="text-red-300">
                        Risk Score: {tx.riskScore}% | Amount: {tx.amount}
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Risk Reason:</h4>
                  <p className="text-gray-300">{tx.reason}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Wallet History:</h4>
                  <p className="text-gray-300">{tx.walletHistory}</p>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Trace Wallet
                  </Button>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Send className="h-4 w-4 mr-2" />
                    Report to FIU
                  </Button>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  )

  const renderRiskEngine = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Risk Scoring Engine</h2>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Wallet Analysis</CardTitle>
            <CardDescription className="text-gray-400">Enter a wallet address to analyze risk factors</CardDescription>
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
              <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Analysis Results</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Risk Score:</label>
                    <div
                      className={`text-2xl font-bold ${riskAnalysis.riskLevel === "high" ? "text-red-400" : riskAnalysis.riskLevel === "medium" ? "text-yellow-400" : "text-green-400"}`}
                    >
                      {riskAnalysis.riskScore}%
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Risk Level:</label>
                    <Badge className={getRiskColor(riskAnalysis.riskLevel)}>
                      {riskAnalysis.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Transaction Count:</label>
                    <div className="text-white">{riskAnalysis.transactionCount}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Total Volume:</label>
                    <div className="text-white">{riskAnalysis.totalVolume} BTC</div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm text-gray-400">Risk Flags:</label>
                  <div className="flex gap-2 mt-1">
                    {riskAnalysis.flags.map((flag, index) => (
                      <Badge key={index} variant="destructive">
                        {flag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Risk Pattern Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              risk: {
                label: "Risk Level",
                color: "#EF4444",
              },
            }}
            className="h-[300px]"
          >
            <BarChart data={riskPatternData}>
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="risk" fill="#EF4444" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Compliance Reports</h2>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Generate Compliance Report</CardTitle>
          <CardDescription className="text-gray-400">
            Create detailed reports for regulatory authorities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Report Summary</label>
            <Textarea
              placeholder="Enter report summary and findings..."
              className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
            />
          </div>

          <div className="flex space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Generate PDF
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Send className="h-4 w-4 mr-2" />
              Send to Authority
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: "RPT-001", title: "Q4 2023 AML Compliance Report", date: "2024-01-10", status: "Submitted" },
              { id: "RPT-002", title: "High-Risk Wallet Investigation", date: "2024-01-08", status: "Pending" },
              { id: "RPT-003", title: "Suspicious Activity Report #45", date: "2024-01-05", status: "Approved" },
            ].map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{report.title}</h4>
                  <p className="text-gray-400 text-sm">
                    {report.id} • {report.date}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge
                    variant={
                      report.status === "Approved" ? "default" : report.status === "Pending" ? "secondary" : "outline"
                    }
                  >
                    {report.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "flagged":
        return renderFlaggedTransactions()
      case "risk-engine":
        return renderRiskEngine()
      case "reports":
        return renderReports()
      case "transactions":
      case "kyc":
      case "law-enforcement":
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400 text-lg">
              Coming Soon - {menuItems.find((item) => item.id === activeTab)?.label}
            </p>
          </div>
        )
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Top Navigation */}
      <header className="bg-gray-900/50 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Crypto Shield</span>
            </div>
            <div className="hidden md:block text-gray-400 text-sm">AI-powered firewall for crypto crime</div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-300">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/30 border-r border-gray-700 min-h-[calc(100vh-73px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700/50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  )
}

export default Dashboard

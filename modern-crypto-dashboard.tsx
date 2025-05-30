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
  Star,
  CheckCircle,
  MessageCircle,
  Mail,
  Phone,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AuthModal } from "./components/auth-modal"
import { KYCPortal } from "./components/kyc-portal"
import { db } from "./lib/database"

const ModernCryptoDashboard = () => {
  const [activeTab, setActiveTab] = useState("home")
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
    setActiveTab("home")
  }

  const analyzeWallet = async () => {
    if (!walletInput) return

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

  const getRiskColor = (level) => {
    switch (level) {
      case "high":
        return "text-red-500 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-500 bg-gray-50 border-gray-200"
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

  const riskPatternData = [
    { time: "00:00", risk: 20, volume: 1200 },
    { time: "04:00", risk: 15, volume: 800 },
    { time: "08:00", risk: 45, volume: 3200 },
    { time: "12:00", risk: 80, volume: 5600 },
    { time: "16:00", risk: 65, volume: 4200 },
    { time: "20:00", risk: 35, volume: 2800 },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Compliance Officer",
      company: "CryptoBank",
      rating: 5,
      text: "CryptoAML Shield has revolutionized our compliance process. The AI-powered detection is incredibly accurate.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Michael Rodriguez",
      role: "Risk Manager",
      company: "BlockChain Finance",
      rating: 5,
      text: "The real-time monitoring and automated reporting have saved us countless hours of manual work.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Emily Watson",
      role: "Chief Security Officer",
      company: "Digital Assets Corp",
      rating: 5,
      text: "Outstanding platform with comprehensive KYC integration. Highly recommended for any crypto business.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  const faqItems = [
    {
      question: "How do I apply for a loan through your platform?",
      answer:
        "Our AI-powered risk assessment provides instant loan pre-approval. Simply complete our secure application form with your financial information and receive a decision within minutes.",
    },
    {
      question: "Is my information safe on your platform?",
      answer:
        "Yes, we use bank-level encryption and comply with all major security standards including SOC 2 Type II and ISO 27001 to protect your sensitive financial data.",
    },
    {
      question: "How long does the approval process take?",
      answer:
        "Our automated system provides instant pre-approval for most applications. Final approval typically takes 24-48 hours after document verification.",
    },
    {
      question: "Can I learn all of my own data?",
      answer:
        "Absolutely. You have full access to all your data through our secure dashboard, and you can export or delete your information at any time in compliance with GDPR.",
    },
    {
      question: "Are there any hidden fees?",
      answer:
        "No hidden fees. All costs are clearly disclosed upfront, including processing fees, interest rates, and any applicable charges before you commit to any service.",
    },
  ]

  const renderHeader = () => (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CryptoAML Shield</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {[
              { id: "home", label: "Home" },
              { id: "features", label: "Features" },
              { id: "how-it-works", label: "How It Works" },
              { id: "pricing", label: "Pricing" },
              { id: "security", label: "Security" },
              { id: "contact", label: "Contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-sm font-medium transition-colors ${
                  activeTab === item.id ? "text-teal-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("dashboard")}
                  className="border-teal-200 text-teal-600 hover:bg-teal-50"
                >
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="border-teal-200 text-teal-600 hover:bg-teal-50"
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
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-2">
              {[
                { id: "home", label: "Home" },
                { id: "features", label: "Features" },
                { id: "how-it-works", label: "How It Works" },
                { id: "pricing", label: "Pricing" },
                { id: "security", label: "Security" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveTab("dashboard")
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full border-teal-200 text-teal-600 hover:bg-teal-50"
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full text-gray-600 hover:text-gray-900"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAuthModalOpen(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full border-teal-200 text-teal-600 hover:bg-teal-50"
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

  const renderHeroSection = () => (
    <section className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Empowering Your <span className="text-teal-300">Crypto Security</span> Future
              </h1>
              <p className="text-xl text-teal-100 leading-relaxed">
                Advanced AI-powered anti-money laundering solutions for cryptocurrency businesses. Protect your platform
                with real-time threat detection and compliance automation.
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
                <div className="text-3xl font-bold text-white">126k</div>
                <div className="text-teal-200">Transactions Monitored</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">1.3M</div>
                <div className="text-teal-200">Threats Detected</div>
              </div>
            </div>
          </div>

          {/* Right Content - Crypto Card Visualization */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main Card */}
              <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl p-8 shadow-2xl transform rotate-6 hover:rotate-3 transition-transform duration-300">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white/80 text-sm">Crypto Wallet</div>
                      <div className="text-white font-bold text-lg">AML Protected</div>
                    </div>
                    <div className="w-12 h-8 bg-white/20 rounded-md flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-white/80 text-sm">Wallet Address</div>
                    <div className="text-white font-mono text-lg">0x742d35Cc6634C0532925a3b8D</div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-white/80 text-sm">Risk Score</div>
                      <div className="text-white font-bold text-xl">Low Risk</div>
                    </div>
                    <div className="text-white/80 text-sm">AI Verified ✓</div>
                  </div>
                </div>
              </div>

              {/* Background Cards */}
              <div className="absolute top-4 left-4 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-8 shadow-xl transform -rotate-6 -z-10 opacity-80">
                <div className="space-y-6">
                  <div className="h-4 bg-white/20 rounded w-3/4"></div>
                  <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  <div className="h-8 bg-white/20 rounded w-full"></div>
                </div>
              </div>
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
      </div>
    </section>
  )

  const renderFeaturesSection = () => (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Why We're the Right Fit</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We blend cutting-edge technology with user-friendly design to deliver the most comprehensive crypto AML
            solution. Our platform offers transparent pricing, and round-the-clock support, empowering you to manage
            your finances with confidence and ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-8 border-2 border-gray-100 hover:border-teal-200 transition-colors">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Detection</h3>
            <p className="text-gray-600">
              Advanced machine learning algorithms analyze transaction patterns in real-time to detect suspicious
              activities with 94.7% accuracy.
            </p>
          </Card>

          <Card className="text-center p-8 border-2 border-gray-100 hover:border-teal-200 transition-colors">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Compliance Automation</h3>
            <p className="text-gray-600">
              Automated reporting and compliance workflows ensure you meet all regulatory requirements without manual
              intervention.
            </p>
          </Card>

          <Card className="text-center p-8 border-2 border-gray-100 hover:border-teal-200 transition-colors">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Monitoring</h3>
            <p className="text-gray-600">
              24/7 transaction monitoring with instant alerts for high-risk activities and suspicious wallet behaviors.
            </p>
          </Card>
        </div>

        {/* Visual Element */}
        <div className="relative">
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-3xl p-12 text-center">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="relative inline-block">
                <div className="w-32 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl shadow-lg transform rotate-12"></div>
                <div className="absolute top-2 left-2 w-32 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg transform -rotate-6"></div>
                <div className="absolute top-4 left-4 w-32 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-lg"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Secure. Compliant. Intelligent.</h3>
              <p className="text-gray-600">
                Join thousands of crypto businesses that trust our platform for their AML compliance needs.
              </p>
              <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3">Learn More</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  const renderHowItWorksSection = () => (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">How We Help You Succeed</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process ensures quick setup and immediate protection for your crypto business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Step 1 */}
          <Card className="text-center p-8 bg-white border-2 border-gray-100">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-2xl font-bold text-teal-600">1</div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h3>
            <p className="text-gray-600">
              A simple step-by-step setup guide to get your AML monitoring system up and running in minutes.
            </p>
          </Card>

          {/* Step 2 */}
          <Card className="text-center p-8 bg-white border-2 border-gray-100">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-2xl font-bold text-teal-600">2</div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Journey</h3>
            <p className="text-gray-600">
              A comprehensive guide that helps you understand and navigate your compliance journey with confidence.
            </p>
          </Card>

          {/* Step 3 */}
          <Card className="text-center p-8 bg-white border-2 border-gray-100">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-2xl font-bold text-teal-600">3</div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Simplify Compliance</h3>
            <p className="text-gray-600">
              A straightforward approach to managing your compliance requirements with automated reporting and alerts.
            </p>
          </Card>

          {/* Step 4 */}
          <Card className="text-center p-8 bg-white border-2 border-gray-100">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">You Succeed</h3>
            <p className="text-gray-600">
              A comprehensive suite that helps you achieve your compliance goals while focusing on growing your
              business.
            </p>
          </Card>

          {/* Step 5 */}
          <Card className="text-center p-8 bg-white border-2 border-gray-100">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Sign-Up to Success</h3>
            <p className="text-gray-600">
              A streamlined onboarding process that gets you from sign-up to full compliance protection in record time.
            </p>
          </Card>

          {/* Step 6 */}
          <Card className="text-center p-8 bg-white border-2 border-gray-100">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ongoing Protection</h3>
            <p className="text-gray-600">
              Continuous monitoring and updates ensure your compliance strategy evolves with changing regulations.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )

  const renderTestimonialsSection = () => (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Real Stories, Real Success</h2>
              <p className="text-xl text-gray-600">
                Discover how businesses like yours have transformed their compliance operations with our platform.
              </p>
            </div>

            {/* Testimonials */}
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6 border-2 border-gray-100">
                  <div className="flex items-start space-x-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <div className="flex space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {testimonial.role} at {testimonial.company}
                      </p>
                      <p className="text-gray-700">{testimonial.text}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Content - Services */}
          <div className="space-y-8">
            <Card className="p-8 bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-100">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">What we can do for you</h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Easy Management Access</h4>
                      <p className="text-gray-600 text-sm">
                        Streamlined dashboard for monitoring all compliance activities and generating reports
                        seamlessly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Multi-device Support Access</h4>
                      <p className="text-gray-600 text-sm">
                        Access your compliance dashboard from any device with full functionality and real-time
                        synchronization.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">High Level Security</h4>
                      <p className="text-gray-600 text-sm">
                        Enterprise-grade security with end-to-end encryption, multi-factor authentication, and
                        compliance certifications.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visual Element */}
                <div className="relative mt-8">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-medium text-gray-900">CryptoAML Shield</div>
                      <div className="w-8 h-5 bg-teal-500 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">AI-Powered Protection</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )

  const renderFAQSection = () => (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">
                Find answers to common questions about our crypto AML platform and compliance solutions.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white border border-gray-200 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Need More Help?</h3>
                    <p className="text-gray-600 text-sm">Our support team is here to assist you</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-teal-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Live Chat Available</span>
                    </div>
                    <p className="text-sm text-gray-600">Get instant answers to your questions</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Mail className="h-4 w-4 text-teal-600" />
                      <span>support@cryptoaml.com</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-teal-600" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Contact Support</Button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-teal-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-100 rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  )

  const renderCTASection = () => (
    <section className="py-24 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold">Facilitate Accessible Financial Services</h2>
              <p className="text-xl text-teal-100">
                Empower your crypto business with comprehensive AML compliance solutions. Join thousands of companies
                that trust our platform for their regulatory needs.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-teal-300" />
                <span className="text-teal-100">Real-time transaction monitoring</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-teal-300" />
                <span className="text-teal-100">Automated compliance reporting</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-teal-300" />
                <span className="text-teal-100">AI-powered risk assessment</span>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-white text-teal-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Get Started Today
            </Button>
          </div>

          {/* Right Content - Card Visual */}
          <div className="relative">
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl p-8 shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white/80 text-sm">Compliance Dashboard</div>
                      <div className="text-white font-bold text-lg">CryptoAML Shield</div>
                    </div>
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-white/80 text-sm">Risk Score</div>
                      <div className="text-white font-bold text-2xl">94.7%</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="text-white/80 text-xs">Transactions</div>
                        <div className="text-white font-bold">126k</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="text-white/80 text-xs">Flagged</div>
                        <div className="text-white font-bold">342</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

  const renderFooter = () => (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">CryptoAML Shield</span>
            </div>
            <p className="text-gray-400">
              Advanced AI-powered anti-money laundering solutions for the cryptocurrency industry.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-xs">f</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-xs">t</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-xs">in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              {["About Us", "Features", "Pricing", "Security", "Contact"].map((link) => (
                <button key={link} className="block text-gray-400 hover:text-white transition-colors">
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <div className="space-y-2">
              {["AML Monitoring", "Risk Assessment", "Compliance Reports", "KYC Verification", "API Integration"].map(
                (service) => (
                  <button key={service} className="block text-gray-400 hover:text-white transition-colors">
                    {service}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-gray-400">Stay updated with our latest features and compliance insights.</p>
            <div className="space-y-2">
              <Input
                placeholder="Your email address"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 CryptoAML Shield. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )

  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <Badge className="bg-teal-100 text-teal-800">{currentUser?.role || "User"}</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setActiveTab("home")}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Transactions</CardTitle>
                <Activity className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardStats.totalTransactions.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Flagged Transactions</CardTitle>
                <Flag className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.flaggedTransactions}</div>
                <p className="text-xs text-red-500">+2.1% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">High-Risk Wallets</CardTitle>
                <Wallet className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.highRiskWallets}</div>
                <p className="text-xs text-yellow-600">+5.2% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending KYC</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.pendingKYC}</div>
                <p className="text-xs text-green-600">-8.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Transaction Volume & Risk Trends</CardTitle>
                <CardDescription className="text-gray-600">Monthly analysis of transaction patterns</CardDescription>
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
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
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

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Risk Distribution by Hour</CardTitle>
                <CardDescription className="text-gray-600">24-hour risk pattern analysis</CardDescription>
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
                      <XAxis dataKey="time" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="risk" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Risk Engine */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-teal-600" />
                AI-Powered Wallet Risk Analysis
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter a wallet address for comprehensive AI-powered risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-3">
                <Input
                  placeholder="Enter wallet address (0x...)"
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  className="bg-white border-gray-300"
                />
                <Button onClick={analyzeWallet} className="bg-teal-500 hover:bg-teal-600 text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Analyze
                </Button>
              </div>

              {riskAnalysis && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Results</h3>

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
                      <div className="text-sm text-gray-600">Risk Score</div>
                    </div>
                    <div className="text-center">
                      <Badge className={getRiskColor(riskAnalysis.riskLevel)}>
                        {riskAnalysis.riskLevel.toUpperCase()}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">Risk Level</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-gray-900">{riskAnalysis.transactionCount}</div>
                      <div className="text-xs text-gray-600">Transactions</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900">{riskAnalysis.totalVolume} BTC</div>
                      <div className="text-xs text-gray-600">Total Volume</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900">{riskAnalysis.connections}</div>
                      <div className="text-xs text-gray-600">Connections</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">KYC Status:</label>
                      <Badge
                        className={
                          riskAnalysis.kycStatus === "verified"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }
                      >
                        {riskAnalysis.kycStatus}
                      </Badge>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Risk Flags:</label>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {riskAnalysis.flags.map((flag, index) => (
                          <Badge key={index} className="bg-red-50 text-red-600 border-red-200">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                      <Flag className="h-3 w-3 mr-1" />
                      Flag Wallet
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-300 text-gray-700">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">Recent High-Risk Transactions</CardTitle>
                  <CardDescription className="text-gray-600">
                    Latest cryptocurrency transactions flagged by AI analysis
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="text-gray-600">Tx ID</TableHead>
                    <TableHead className="text-gray-600">From → To</TableHead>
                    <TableHead className="text-gray-600">Amount</TableHead>
                    <TableHead className="text-gray-600">Risk Score</TableHead>
                    <TableHead className="text-gray-600">Flags</TableHead>
                    <TableHead className="text-gray-600">Date/Time</TableHead>
                    <TableHead className="text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 5).map((tx) => (
                    <TableRow key={tx.id} className="border-gray-200 hover:bg-gray-50">
                      <TableCell className="text-teal-600 font-mono text-sm">{tx.tx_id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-gray-900 font-mono text-xs">{tx.from_wallet}</div>
                          <div className="text-gray-400 text-xs">↓</div>
                          <div className="text-gray-900 font-mono text-xs">{tx.to_wallet}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-900 font-semibold">
                          {tx.amount} {tx.currency}
                        </div>
                        <div className="text-gray-500 text-xs">${(tx.amount * 45000).toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRiskColor(tx.risk_level)}>
                          {tx.risk_score}% {tx.risk_level.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {tx.flags?.map((flag, index) => (
                            <Badge key={index} className="text-xs bg-red-50 text-red-600 border-red-200">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">{new Date(tx.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
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

  const renderKYCDashboard = () => <KYCPortal />

  const renderContent = () => {
    if (isAuthenticated && activeTab === "dashboard") {
      return renderDashboard()
    }

    if (isAuthenticated && activeTab === "kyc") {
      return renderKYCDashboard()
    }

    switch (activeTab) {
      case "home":
        return (
          <>
            {renderHeroSection()}
            {renderFeaturesSection()}
            {renderHowItWorksSection()}
            {renderTestimonialsSection()}
            {renderFAQSection()}
            {renderCTASection()}
          </>
        )
      case "features":
        return renderFeaturesSection()
      case "how-it-works":
        return renderHowItWorksSection()
      case "pricing":
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing Plans</h2>
              <p className="text-gray-600">Coming Soon - Flexible pricing for businesses of all sizes</p>
            </div>
          </div>
        )
      case "security":
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Security & Compliance</h2>
              <p className="text-gray-600">Enterprise-grade security with industry-leading compliance standards</p>
            </div>
          </div>
        )
      case "contact":
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">Get in touch with our team for personalized support</p>
            </div>
          </div>
        )
      default:
        return (
          <>
            {renderHeroSection()}
            {renderFeaturesSection()}
            {renderHowItWorksSection()}
            {renderTestimonialsSection()}
            {renderFAQSection()}
            {renderCTASection()}
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {renderHeader()}
      <main>{renderContent()}</main>
      {!isAuthenticated && renderFooter()}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </div>
  )
}

export default ModernCryptoDashboard

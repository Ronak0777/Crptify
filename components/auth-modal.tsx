"use client"

import type React from "react"

import { useState } from "react"
import { X, Eye, EyeOff, Shield, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (email: string, password: string) => void
  onSignup: (userData: any) => void
}

export function AuthModal({ isOpen, onClose, onLogin, onSignup }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "", remember: false })
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    walletAddress: "",
    password: "",
    confirmPassword: "",
    documentType: "",
    panCard: null as File | null,
    uniqueId: null as File | null,
    agreeTerms: false,
    agreeKYC: false,
  })

  if (!isOpen) return null

  const handleFileUpload = (field: "panCard" | "uniqueId", file: File | null) => {
    setSignupData((prev) => ({ ...prev, [field]: file }))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(loginData.email, loginData.password)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords don't match")
      return
    }
    onSignup(signupData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-gray-900/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="relative p-6 text-center border-b border-gray-700/50">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">CryptoAML Shield</h1>
          </div>
          <p className="text-gray-400 text-sm">Shielding Crypto. Securing Trust.</p>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
              <TabsTrigger value="login" className="data-[state=active]:bg-blue-600">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-blue-600">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-gray-300">
                    Email or Wallet Address
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-gray-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                      className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={loginData.remember}
                      onCheckedChange={(checked) => setLoginData((prev) => ({ ...prev, remember: !!checked }))}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-300">
                      Remember me
                    </Label>
                  </div>
                  <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto">
                    Forgot Password?
                  </Button>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Login Securely
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name" className="text-gray-300">
                    Full Name
                  </Label>
                  <Input
                    id="signup-name"
                    placeholder="Enter your full name"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="signup-email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="wallet-address" className="text-gray-300">
                    Wallet Address (Optional)
                  </Label>
                  <Input
                    id="wallet-address"
                    placeholder="0x..."
                    value={signupData.walletAddress}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, walletAddress: e.target.value }))}
                    className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="signup-password" className="text-gray-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={signupData.password}
                        onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                        className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirm-password" className="text-gray-300">
                      Confirm
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        className="bg-gray-800/50 border-gray-600 text-white focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* KYC Section */}
                <div className="border-t border-gray-700/50 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-3">KYC Verification</h3>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-300">Document Type</Label>
                      <Select
                        value={signupData.documentType}
                        onValueChange={(value) => setSignupData((prev) => ({ ...prev, documentType: value }))}
                      >
                        <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="license">Driver's License</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-gray-300">PAN Card</Label>
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload("panCard", e.target.files?.[0] || null)}
                            className="bg-gray-800/50 border-gray-600 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded"
                          />
                          {signupData.panCard && (
                            <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-400" />
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300">ID Document</Label>
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload("uniqueId", e.target.files?.[0] || null)}
                            className="bg-gray-800/50 border-gray-600 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded"
                          />
                          {signupData.uniqueId && (
                            <Check className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-green-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agree-terms"
                      checked={signupData.agreeTerms}
                      onCheckedChange={(checked) => setSignupData((prev) => ({ ...prev, agreeTerms: !!checked }))}
                    />
                    <Label htmlFor="agree-terms" className="text-sm text-gray-300">
                      I agree to the Terms & Conditions
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agree-kyc"
                      checked={signupData.agreeKYC}
                      onCheckedChange={(checked) => setSignupData((prev) => ({ ...prev, agreeKYC: !!checked }))}
                    />
                    <Label htmlFor="agree-kyc" className="text-sm text-gray-300">
                      I confirm my details are accurate and consent to KYC verification
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={!signupData.agreeTerms || !signupData.agreeKYC}
                >
                  Create Verified Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

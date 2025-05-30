"use client"

import { useState, useEffect } from "react"
import { Check, X, Eye, Clock, FileText, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { db } from "@/lib/database"

interface KYCRecord {
  id: number
  user_id: number
  wallet_address: string
  document_type: string
  document_number: string
  status: string
  created_at: string
  full_name: string
  email: string
}

export function KYCPortal() {
  const [kycRecords, setKycRecords] = useState<KYCRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<KYCRecord | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadKYCRecords()
  }, [])

  const loadKYCRecords = async () => {
    try {
      const records = await db.getKYCRecords()
      setKycRecords(records as KYCRecord[])
    } catch (error) {
      console.error("Failed to load KYC records:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateKYCStatus = async (id: number, status: string) => {
    try {
      await db.updateKYCStatus(id, status)
      await loadKYCRecords()
      setSelectedRecord(null)
    } catch (error) {
      console.error("Failed to update KYC status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <Check className="h-4 w-4" />
      case "rejected":
        return <X className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading KYC records...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">KYC Verification Portal</h2>
          <p className="text-gray-400">Review and manage user identity verification requests</p>
        </div>
        <div className="flex space-x-2">
          <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
            {kycRecords.filter((r) => r.status === "pending").length} Pending
          </Badge>
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
            {kycRecords.filter((r) => r.status === "verified").length} Verified
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{kycRecords.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {kycRecords.filter((r) => r.status === "pending").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Verified Users</CardTitle>
            <Check className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {kycRecords.filter((r) => r.status === "verified").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Rejection Rate</CardTitle>
            <X className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {kycRecords.length > 0
                ? Math.round((kycRecords.filter((r) => r.status === "rejected").length / kycRecords.length) * 100)
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KYC Records Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">KYC Applications</CardTitle>
          <CardDescription className="text-gray-400">Review user identity verification submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">User</TableHead>
                <TableHead className="text-gray-300">Wallet Address</TableHead>
                <TableHead className="text-gray-300">Document Type</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Submitted</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kycRecords.map((record) => (
                <TableRow key={record.id} className="border-gray-700 hover:bg-gray-700/30">
                  <TableCell>
                    <div>
                      <div className="text-white font-medium">{record.full_name}</div>
                      <div className="text-gray-400 text-sm">{record.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300 font-mono text-sm">{record.wallet_address}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {record.document_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(record.status)}>
                      {getStatusIcon(record.status)}
                      <span className="ml-1 capitalize">{record.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{new Date(record.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          onClick={() => setSelectedRecord(record)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-white">KYC Review - {record.full_name}</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Review user documents and approve or reject the KYC application
                          </DialogDescription>
                        </DialogHeader>

                        {selectedRecord && (
                          <div className="space-y-6">
                            {/* User Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-300">Full Name</label>
                                <div className="text-white">{selectedRecord.full_name}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-300">Email</label>
                                <div className="text-white">{selectedRecord.email}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-300">Wallet Address</label>
                                <div className="text-white font-mono text-sm">{selectedRecord.wallet_address}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-300">Document Type</label>
                                <div className="text-white capitalize">{selectedRecord.document_type}</div>
                              </div>
                            </div>

                            {/* Document Preview */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white">Uploaded Documents</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                  <div className="text-sm text-gray-300">PAN Card</div>
                                  <Button variant="link" className="text-blue-400 p-0 h-auto">
                                    View Document
                                  </Button>
                                </div>
                                <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                  <div className="text-sm text-gray-300">ID Document</div>
                                  <Button variant="link" className="text-blue-400 p-0 h-auto">
                                    View Document
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Review Notes */}
                            <div>
                              <label className="text-sm font-medium text-gray-300 mb-2 block">Review Notes</label>
                              <Textarea
                                placeholder="Add notes about the verification..."
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3">
                              <Button
                                onClick={() => updateKYCStatus(selectedRecord.id, "verified")}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => updateKYCStatus(selectedRecord.id, "rejected")}
                                variant="destructive"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button variant="outline" className="border-gray-600 text-gray-300">
                                Request More Info
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

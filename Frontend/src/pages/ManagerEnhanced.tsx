import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { mockApprovalRequests, mockExpenses } from "@/data/mockData";
import { CheckCircle, XCircle, Eye, Clock, DollarSign, User, Calendar, FileText, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Expense {
  _id: string;
  description: string;
  category: string;
  totalAmount: string;
  amountInCompanyCurrency: number;
  originalCurrency: string;
  exchangeRate: number;
  expenseDate: string;
  status: 'DRAFT' | 'WAITING_APPROVAL' | 'APPROVED' | 'REJECTED';
  receipts: string[];
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  paidBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface ApprovalRequest {
  _id: string;
  expenseId: Expense;
  approvalRuleId: {
    _id: string;
    name: string;
    description: string;
  };
  currentApproverId: string;
  overallStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvalFlow: Array<{
    approverId: string;
    order: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    isRequired: boolean;
    isManager: boolean;
  }>;
  createdAt: string;
}

const ManagerEnhanced = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [approvalComments, setApprovalComments] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Mock data for demonstration
  const [expenses] = useState<Expense[]>(mockExpenses || []);

  // Fetch approval requests on component mount
  useEffect(() => {
    // Initialize with mock data or fetch from API
    if (mockApprovalRequests && Array.isArray(mockApprovalRequests)) {
      setApprovalRequests(mockApprovalRequests);
    }

    // Uncomment below to fetch from real API
    /*
    const fetchApprovalRequests = async () => {
      try {
        setLoading(true);
        const response = await apiService.getManagerApprovalRequests();
        setApprovalRequests(response.data || []);
      } catch (error) {
        console.error('Failed to fetch approval requests:', error);
        toast({
          title: "Error",
          description: "Failed to load approval requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchApprovalRequests();
    */
  }, []);

  const handleApprove = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      setLoading(true);

      // In a real app, this would call the API
      // await apiService.approveExpense(requestId, approvalComments);

      // Update local state
      setApprovalRequests(prev =>
        prev.map(req =>
          req._id === requestId
            ? { ...req, overallStatus: 'APPROVED' as const }
            : req
        )
      );

      setShowApprovalDialog(false);
      setApprovalComments("");
      setSelectedRequest(null);

      toast({
        title: "Success",
        description: "Expense approved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve expense",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessingId(requestId);
      setLoading(true);

      // In a real app, this would call the API
      // await apiService.rejectExpense(requestId, rejectionReason);

      // Update local state
      setApprovalRequests(prev =>
        prev.map(req =>
          req._id === requestId
            ? { ...req, overallStatus: 'REJECTED' as const }
            : req
        )
      );

      setShowRejectionDialog(false);
      setRejectionReason("");
      setSelectedRequest(null);

      toast({
        title: "Rejected",
        description: "Expense rejected successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject expense",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setProcessingId(null);
    }
  };

  const openApprovalDialog = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setShowApprovalDialog(true);
  };

  const openRejectionDialog = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setShowRejectionDialog(true);
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: "secondary" as const, className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" },
      APPROVED: { variant: "default" as const, className: "bg-green-500/10 text-green-700 border-green-500/20" },
      REJECTED: { variant: "destructive" as const, className: "bg-red-500/10 text-red-700 border-red-500/20" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (!user || (user.role !== 'MANAGER' && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const pendingRequests = (approvalRequests || []).filter(req => req?.overallStatus === 'PENDING');
  const totalPendingAmount = pendingRequests.reduce((sum, req) => sum + (req?.expenseId?.amountInCompanyCurrency || 0), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="py-20 px-4 bg-background flex-1">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold">Manager Dashboard</h1>
              <p className="text-muted-foreground mt-2">Review and approve expense requests</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {user?.role || 'MANAGER'}
              </Badge>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingRequests.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting your review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pending Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalPendingAmount)}</div>
                <p className="text-xs text-muted-foreground">In company currency</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(approvalRequests || []).filter(req =>
                    req?.overallStatus === 'APPROVED' &&
                    req?.createdAt &&
                    new Date(req.createdAt).toDateString() === new Date().toDateString()
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">Expenses approved</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(approvalRequests || []).filter(req =>
                    req?.overallStatus === 'REJECTED' &&
                    req?.createdAt &&
                    new Date(req.createdAt).toDateString() === new Date().toDateString()
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">Expenses rejected</p>
              </CardContent>
            </Card>
          </div>

          {/* Approval Requests Table */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Pending Approvals</CardTitle>
              <p className="text-muted-foreground">Review and take action on expense requests</p>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Expense Details</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(pendingRequests || []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                            <span>No pending approvals</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      (pendingRequests || []).map((request) => (
                        <TableRow key={request._id} className="hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{request?.expenseId?.description || 'N/A'}</div>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {(request?.expenseId?.receipts || []).length} receipt(s)
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{request?.expenseId?.userId?.name || 'N/A'}</div>
                              <div className="text-sm text-muted-foreground">{request?.expenseId?.userId?.email || ''}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{request?.expenseId?.category || 'N/A'}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-semibold">{request?.expenseId?.totalAmount || 'N/A'}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatCurrency(request?.expenseId?.amountInCompanyCurrency || 0)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              {request?.expenseId?.expenseDate ? formatDate(request.expenseId.expenseDate) : 'N/A'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(request?.overallStatus || 'PENDING')}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 justify-center">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedRequest(request)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Expense Details</DialogTitle>
                                    <DialogDescription>
                                      Review the complete expense information before making a decision
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedRequest && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-sm font-medium">Description</Label>
                                          <p className="text-sm">{selectedRequest?.expenseId?.description || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Category</Label>
                                          <p className="text-sm">{selectedRequest?.expenseId?.category || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Amount (Original)</Label>
                                          <p className="text-sm font-semibold">{selectedRequest?.expenseId?.totalAmount || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Amount (Company Currency)</Label>
                                          <p className="text-sm font-semibold">
                                            {formatCurrency(selectedRequest?.expenseId?.amountInCompanyCurrency || 0)}
                                          </p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Exchange Rate</Label>
                                          <p className="text-sm">{selectedRequest?.expenseId?.exchangeRate || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium">Date</Label>
                                          <p className="text-sm">
                                            {selectedRequest?.expenseId?.expenseDate ? formatDate(selectedRequest.expenseId.expenseDate) : 'N/A'}
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Receipts</Label>
                                        <div className="flex gap-2 mt-2">
                                          {(selectedRequest?.expenseId?.receipts || []).length > 0 ? (
                                            (selectedRequest.expenseId.receipts || []).map((receipt, index) => (
                                              <Button
                                                key={index}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(receipt, '_blank')}
                                              >
                                                Receipt {index + 1}
                                              </Button>
                                            ))
                                          ) : (
                                            <p className="text-sm text-muted-foreground">No receipts available</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button
                                      variant="destructive"
                                      onClick={() => {
                                        openRejectionDialog(selectedRequest!);
                                      }}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        openApprovalDialog(selectedRequest!);
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <Button
                                size="sm"
                                onClick={() => openApprovalDialog(request)}
                                disabled={processingId === request._id}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                {processingId === request._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openRejectionDialog(request)}
                                disabled={processingId === request._id}
                              >
                                {processingId === request._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Expense</DialogTitle>
            <DialogDescription>
              Add any comments for this approval (optional)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="approvalComments">Comments</Label>
              <Textarea
                id="approvalComments"
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                placeholder="Enter approval comments..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedRequest && handleApprove(selectedRequest._id)}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Approve Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Expense</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this expense
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Reason for Rejection</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={3}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedRequest && handleReject(selectedRequest._id)}
              disabled={loading || !rejectionReason.trim()}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Reject Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManagerEnhanced;
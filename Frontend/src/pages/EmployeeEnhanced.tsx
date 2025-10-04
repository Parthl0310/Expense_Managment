import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { mockExpenses, expenseCategories, expenseStatuses } from "@/data/mockData";
import { Upload, Camera, Loader2, Plus, Eye, Send, DollarSign, Calendar, FileText, User, Lock, CheckCircle, XCircle } from "lucide-react";
import Tesseract from "tesseract.js";
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
  remarks?: string;
  createdAt: string;
}

const EmployeeEnhanced = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [newExpense, setNewExpense] = useState({
    description: "",
    date: "",
    category: "",
    paidBy: "",
    remarks: "",
    amount: "",
    currency: "USD",
  });

  // Calculate summary statistics
  const toSubmit = (expenses || []).filter(e => e.status === "DRAFT").reduce((sum, e) => sum + (e.amountInCompanyCurrency || 0), 0);
  const waitingApproval = (expenses || []).filter(e => e.status === "WAITING_APPROVAL").reduce((sum, e) => sum + (e.amountInCompanyCurrency || 0), 0);
  const approved = (expenses || []).filter(e => e.status === "APPROVED").reduce((sum, e) => sum + (e.amountInCompanyCurrency || 0), 0);
  const rejected = (expenses || []).filter(e => e.status === "REJECTED").reduce((sum, e) => sum + (e.amountInCompanyCurrency || 0), 0);

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const extractReceiptData = async (imageBase64: string) => {
    setIsExtracting(true);
    try {
      const result = await Tesseract.recognize(imageBase64, "eng", {
        logger: (m) => console.log(m),
      });

      const text = result.data.text;
      console.log("Extracted text:", text);

      // Enhanced regex to detect amount and currency
      const amountMatch = text.match(/(?:₹|INR|\$|USD|€|EUR|£|GBP)?\s?(\d+(?:\.\d{1,2})?)/);
      const extractedAmount = amountMatch ? amountMatch[1] : "0";

      // Try to detect currency
      let detectedCurrency = "USD";
      if (text.includes('₹') || text.includes('INR')) detectedCurrency = "INR";
      else if (text.includes('€') || text.includes('EUR')) detectedCurrency = "EUR";
      else if (text.includes('£') || text.includes('GBP')) detectedCurrency = "GBP";

      // Try to detect date
      const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
      const detectedDate = dateMatch ? dateMatch[1] : new Date().toISOString().split("T")[0];

      // Try to detect description from first line
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      const description = lines[0] || "Receipt";

      const extractedData = {
        description: description.substring(0, 100),
        date: detectedDate,
        category: "Other",
        paidBy: user?.name || "Current User",
        remarks: text.substring(0, 200),
        amount: extractedAmount,
        currency: detectedCurrency,
      };

      setNewExpense(extractedData);

      toast({
        title: "Success",
        description: "Receipt data extracted successfully!",
      });
    } catch (error) {
      console.error("OCR error:", error);
      toast({
        title: "Error",
        description: "Failed to extract receipt data",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await convertImageToBase64(file);
      await extractReceiptData(base64);
    }
  };

  const handleCameraCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await convertImageToBase64(file);
      await extractReceiptData(base64);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const expenseData = {
        description: newExpense.description,
        category: newExpense.category,
        totalAmount: `${newExpense.amount} ${newExpense.currency}`,
        expenseDate: newExpense.date,
        paidBy: user?._id || "",
        remarks: newExpense.remarks,
      };

      // In a real app, this would call the API
      // const response = await apiService.createExpense(expenseData);

      const createdExpense: Expense = {
        _id: Date.now().toString(),
        description: newExpense.description,
        category: newExpense.category,
        totalAmount: `${newExpense.amount} ${newExpense.currency}`,
        amountInCompanyCurrency: parseFloat(newExpense.amount) * 83, // Mock conversion rate
        originalCurrency: newExpense.currency,
        exchangeRate: 83,
        expenseDate: newExpense.date,
        status: 'DRAFT',
        receipts: [],
        userId: {
          _id: user?._id || "",
          name: user?.name || "",
          email: user?.email || "",
        },
        paidBy: {
          _id: user?._id || "",
          name: user?.name || "",
          email: user?.email || "",
        },
        remarks: newExpense.remarks,
        createdAt: new Date().toISOString(),
      };

      setExpenses([...expenses, createdExpense]);
      setNewExpense({ description: "", date: "", category: "", paidBy: "", remarks: "", amount: "", currency: "USD" });
      setShowCreateDialog(false);

      toast({
        title: "Success",
        description: "Expense created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create expense",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async (expenseId: string) => {
    try {
      setLoading(true);

      // In a real app, this would call the API
      // await apiService.submitExpenseForApproval(expenseId);

      setExpenses(expenses.map(exp =>
        exp._id === expenseId ? { ...exp, status: 'WAITING_APPROVAL' as const } : exp
      ));

      toast({
        title: "Success",
        description: "Expense submitted for approval",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit expense for approval",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
      DRAFT: { variant: "outline" as const, className: "bg-gray-500/10 text-gray-700 border-gray-500/20" },
      WAITING_APPROVAL: { variant: "secondary" as const, className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" },
      APPROVED: { variant: "default" as const, className: "bg-green-500/10 text-green-700 border-green-500/20" },
      REJECTED: { variant: "destructive" as const, className: "bg-red-500/10 text-red-700 border-red-500/20" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="py-20 px-4 bg-background flex-1">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold">Employee Dashboard</h1>
              <p className="text-muted-foreground mt-2">Manage your expenses and track approvals</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {user.role}
              </Badge>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">To Submit</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{formatCurrency(toSubmit)}</div>
                <p className="text-xs text-muted-foreground">Draft expenses</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Waiting Approval</CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{formatCurrency(waitingApproval)}</div>
                <p className="text-xs text-muted-foreground">Under review</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{formatCurrency(approved)}</div>
                <p className="text-xs text-muted-foreground">Approved expenses</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{formatCurrency(rejected)}</div>
                <p className="text-xs text-muted-foreground">Rejected expenses</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <Tabs defaultValue="expenses" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="expenses">My Expenses</TabsTrigger>
                  <TabsTrigger value="create">
                    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                      <DialogTrigger asChild>
                        <span className="cursor-pointer flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          New Expense
                        </span>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create New Expense</DialogTitle>
                          <DialogDescription>
                            Add a new expense manually or upload a receipt for OCR processing
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateExpense}>
                          <div className="grid gap-6 py-4">
                            {/* OCR Upload Section */}
                            <div className="space-y-4">
                              <Label>Receipt Processing (OCR)</Label>
                              <div className="grid grid-cols-2 gap-4">
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleFileUpload}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-24 flex-col gap-2"
                                  onClick={() => fileInputRef.current?.click()}
                                  disabled={isExtracting}
                                >
                                  {isExtracting ? (
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                  ) : (
                                    <Upload className="h-8 w-8" />
                                  )}
                                  <span>{isExtracting ? "Extracting..." : "Upload Receipt"}</span>
                                </Button>

                                <input
                                  ref={cameraInputRef}
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  className="hidden"
                                  onChange={handleCameraCapture}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-24 flex-col gap-2"
                                  onClick={() => cameraInputRef.current?.click()}
                                  disabled={isExtracting}
                                >
                                  {isExtracting ? (
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                  ) : (
                                    <Camera className="h-8 w-8" />
                                  )}
                                  <span>{isExtracting ? "Extracting..." : "Take Photo"}</span>
                                </Button>
                              </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                  id="description"
                                  value={newExpense.description}
                                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                  id="date"
                                  type="date"
                                  value={newExpense.date}
                                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                  value={newExpense.category}
                                  onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {expenseCategories.map(category => (
                                      <SelectItem key={category} value={category}>
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="paidBy">Paid By</Label>
                                <Input
                                  id="paidBy"
                                  value={newExpense.paidBy}
                                  onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                  id="amount"
                                  type="number"
                                  step="0.01"
                                  value={newExpense.amount}
                                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select
                                  value={newExpense.currency}
                                  onValueChange={(value) => setNewExpense({ ...newExpense, currency: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="INR">INR</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                    <SelectItem value="CAD">CAD</SelectItem>
                                    <SelectItem value="AUD">AUD</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="remarks">Remarks</Label>
                              <Textarea
                                id="remarks"
                                value={newExpense.remarks}
                                onChange={(e) => setNewExpense({ ...newExpense, remarks: e.target.value })}
                                rows={3}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                              Create Expense
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="expenses" className="mt-6">
                  <div className="rounded-lg border bg-card overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(expenses || []).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              <div className="flex flex-col items-center gap-2">
                                <FileText className="h-8 w-8" />
                                <span>No expenses found</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          (expenses || []).map((expense) => (
                            <TableRow key={expense._id} className="hover:bg-muted/30 transition-colors">
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium">{expense.description}</div>
                                  {expense.remarks && (
                                    <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                                      {expense.remarks}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{expense.category}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(expense.expenseDate)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-semibold">{expense.totalAmount}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {formatCurrency(expense.amountInCompanyCurrency)}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(expense.status)}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedExpense(expense);
                                      setShowDetailsDialog(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  {expense.status === "DRAFT" && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleSubmitForApproval(expense._id)}
                                      disabled={loading}
                                    >
                                      {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Send className="h-4 w-4" />
                                      )}
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Expense Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription>
              Complete information about this expense
            </DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm">{selectedExpense.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm">{selectedExpense.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount (Original)</Label>
                  <p className="text-sm font-semibold">{selectedExpense.totalAmount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Amount (Company Currency)</Label>
                  <p className="text-sm font-semibold">
                    {formatCurrency(selectedExpense.amountInCompanyCurrency)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Exchange Rate</Label>
                  <p className="text-sm">{selectedExpense.exchangeRate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm">{formatDate(selectedExpense.expenseDate)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedExpense.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm">{formatDate(selectedExpense.createdAt)}</p>
                </div>
              </div>
              {selectedExpense.remarks && (
                <div>
                  <Label className="text-sm font-medium">Remarks</Label>
                  <p className="text-sm">{selectedExpense.remarks}</p>
                </div>
              )}
              {selectedExpense.receipts.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Receipts</Label>
                  <div className="flex gap-2 mt-2">
                    {selectedExpense.receipts.map((receipt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(receipt, '_blank')}
                      >
                        Receipt {index + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default EmployeeEnhanced;

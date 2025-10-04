// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { useToast } from "@/components/ui/use-toast";
// import { Upload, Camera, ArrowRight } from "lucide-react";

// interface Expense {
//   id: number;
//   employee: string;
//   description: string;
//   date: string;
//   category: string;
//   paidBy: string;
//   remarks: string;
//   amount: number;
//   status: "Draft" | "Submitted" | "Waiting Approval" | "Approved";
// }

// const Employee = () => {
//   const { toast } = useToast();
//   const [expenses, setExpenses] = useState<Expense[]>([
//     {
//       id: 1,
//       employee: "Sarah",
//       description: "Restaurant bill",
//       date: "9th Oct, 2025",
//       category: "Food",
//       paidBy: "Sarah",
//       remarks: "Team lunch",
//       amount: 5000,
//       status: "Draft",
//     },
//   ]);

//   const [newExpense, setNewExpense] = useState({
//     description: "",
//     date: "",
//     category: "",
//     paidBy: "",
//     remarks: "",
//     amount: "",
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const expense: Expense = {
//       id: expenses.length + 1,
//       employee: "Current User",
//       description: newExpense.description,
//       date: newExpense.date,
//       category: newExpense.category,
//       paidBy: newExpense.paidBy,
//       remarks: newExpense.remarks,
//       amount: parseFloat(newExpense.amount),
//       status: "Draft",
//     };
//     setExpenses([...expenses, expense]);
//     setNewExpense({ description: "", date: "", category: "", paidBy: "", remarks: "", amount: "" });
//     toast({
//       title: "Success",
//       description: "Expense added successfully",
//     });
//   };

//   const handleStatusChange = (id: number, newStatus: "Draft" | "Submitted") => {
//     setExpenses(expenses.map(exp => exp.id === id ? { ...exp, status: newStatus } : exp));
//     toast({
//       title: "Status Updated",
//       description: `Expense ${newStatus.toLowerCase()} successfully`,
//     });
//   };

//   const toSubmit = expenses.filter(e => e.status === "Draft").reduce((sum, e) => sum + e.amount, 0);
//   const waitingApproval = expenses.filter(e => e.status === "Waiting Approval").reduce((sum, e) => sum + e.amount, 0);
//   const approved = expenses.filter(e => e.status === "Approved").reduce((sum, e) => sum + e.amount, 0);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
//       <div className="container mx-auto p-6 space-y-8">
//         <div className="text-center space-y-2">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
//             Employee's View
//           </h1>
//           <p className="text-muted-foreground max-w-2xl mx-auto">
//             Upload a receipt from your computer or take a photo of the receipt. Using OCR, a new expense will be created with total amount and other necessary details.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
//             <CardHeader className="pb-3">
//               <CardDescription className="text-xs">To Submit</CardDescription>
//               <CardTitle className="text-3xl font-bold text-orange-500">₹{toSubmit}</CardTitle>
//             </CardHeader>
//           </Card>

//           <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full" />
//             <CardHeader className="pb-3">
//               <CardDescription className="text-xs">Waiting Approval</CardDescription>
//               <CardTitle className="text-3xl font-bold text-blue-500">₹{waitingApproval}</CardTitle>
//             </CardHeader>
//           </Card>

//           <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
//             <CardHeader className="pb-3">
//               <CardDescription className="text-xs">Approved</CardDescription>
//               <CardTitle className="text-3xl font-bold text-green-500">₹{approved}</CardTitle>
//             </CardHeader>
//           </Card>
//         </div>

//         <Card className="shadow-xl">
//           <CardHeader>
//             <Tabs defaultValue="expenses" className="w-full">
//               <TabsList className="grid w-full max-w-md grid-cols-2">
//                 <TabsTrigger value="expenses">Expenses</TabsTrigger>
//                 <TabsTrigger value="new">
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <span className="cursor-pointer">New Expense</span>
//                     </DialogTrigger>
//                     <DialogContent className="max-w-2xl">
//                       <DialogHeader>
//                         <DialogTitle>Create New Expense</DialogTitle>
//                         <DialogDescription>
//                           Add a new expense manually or upload a receipt
//                         </DialogDescription>
//                       </DialogHeader>
//                       <form onSubmit={handleSubmit}>
//                         <div className="grid gap-6 py-4">
//                           <div className="grid grid-cols-2 gap-4">
//                             <Button type="button" variant="outline" className="h-24 flex-col gap-2">
//                               <Upload className="h-8 w-8" />
//                               <span>Upload Receipt</span>
//                             </Button>
//                             <Button type="button" variant="outline" className="h-24 flex-col gap-2">
//                               <Camera className="h-8 w-8" />
//                               <span>Take Photo</span>
//                             </Button>
//                           </div>

//                           <div className="grid grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                               <Label htmlFor="description">Description</Label>
//                               <Input
//                                 id="description"
//                                 value={newExpense.description}
//                                 onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
//                                 required
//                               />
//                             </div>
//                             <div className="space-y-2">
//                               <Label htmlFor="date">Date</Label>
//                               <Input
//                                 id="date"
//                                 type="date"
//                                 value={newExpense.date}
//                                 onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
//                                 required
//                               />
//                             </div>
//                           </div>

//                           <div className="grid grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                               <Label htmlFor="category">Category</Label>
//                               <Select
//                                 value={newExpense.category}
//                                 onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
//                               >
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select category" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="Food">Food</SelectItem>
//                                   <SelectItem value="Transport">Transport</SelectItem>
//                                   <SelectItem value="Accommodation">Accommodation</SelectItem>
//                                   <SelectItem value="Supplies">Supplies</SelectItem>
//                                   <SelectItem value="Other">Other</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                             <div className="space-y-2">
//                               <Label htmlFor="paidBy">Paid By</Label>
//                               <Input
//                                 id="paidBy"
//                                 value={newExpense.paidBy}
//                                 onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
//                                 required
//                               />
//                             </div>
//                           </div>

//                           <div className="space-y-2">
//                             <Label htmlFor="amount">Amount (₹)</Label>
//                             <Input
//                               id="amount"
//                               type="number"
//                               value={newExpense.amount}
//                               onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
//                               required
//                             />
//                           </div>

//                           <div className="space-y-2">
//                             <Label htmlFor="remarks">Remarks</Label>
//                             <Textarea
//                               id="remarks"
//                               value={newExpense.remarks}
//                               onChange={(e) => setNewExpense({ ...newExpense, remarks: e.target.value })}
//                             />
//                           </div>
//                         </div>
//                         <DialogFooter>
//                           <Button type="submit" className="w-full">Save Expense</Button>
//                         </DialogFooter>
//                       </form>
//                     </DialogContent>
//                   </Dialog>
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="expenses" className="mt-6">
//                 <div className="rounded-lg border bg-card overflow-hidden">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="bg-muted/50">
//                         <TableHead>Employee</TableHead>
//                         <TableHead>Description</TableHead>
//                         <TableHead>Date</TableHead>
//                         <TableHead>Category</TableHead>
//                         <TableHead>Paid By</TableHead>
//                         <TableHead>Remarks</TableHead>
//                         <TableHead className="text-right">Amount</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Action</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {expenses.map((expense) => (
//                         <TableRow key={expense.id} className="hover:bg-muted/30 transition-colors">
//                           <TableCell className="font-medium">{expense.employee}</TableCell>
//                           <TableCell>{expense.description}</TableCell>
//                           <TableCell>{expense.date}</TableCell>
//                           <TableCell>
//                             <Badge variant="outline">{expense.category}</Badge>
//                           </TableCell>
//                           <TableCell>{expense.paidBy}</TableCell>
//                           <TableCell className="max-w-[150px] truncate">{expense.remarks}</TableCell>
//                           <TableCell className="text-right font-semibold">₹{expense.amount}</TableCell>
//                           <TableCell>
//                             <Badge
//                               variant={
//                                 expense.status === "Approved"
//                                   ? "default"
//                                   : expense.status === "Draft"
//                                   ? "outline"
//                                   : "secondary"
//                               }
//                               className={
//                                 expense.status === "Approved"
//                                   ? "bg-green-500/10 text-green-700 border-green-500/20"
//                                   : expense.status === "Submitted"
//                                   ? "bg-blue-500/10 text-blue-700 border-blue-500/20"
//                                   : ""
//                               }
//                             >
//                               {expense.status}
//                             </Badge>
//                           </TableCell>
//                           <TableCell>
//                             {expense.status === "Draft" && (
//                               <Button
//                                 size="sm"
//                                 onClick={() => handleStatusChange(expense.id, "Submitted")}
//                               >
//                                 Submit
//                               </Button>
//                             )}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </CardHeader>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Employee;


import { useState, useRef } from "react";
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
import { Upload, Camera, Loader2 } from "lucide-react";
import Tesseract from "tesseract.js";

interface Expense {
  id: number;
  employee: string;
  description: string;
  date: string;
  category: string;
  paidBy: string;
  remarks: string;
  amount: number;
  status: "Draft" | "Submitted" | "Waiting Approval" | "Approved";
}

const Employee = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      employee: "Sarah",
      description: "Restaurant bill",
      date: "9th Oct, 2025",
      category: "Food",
      paidBy: "Sarah",
      remarks: "Team lunch",
      amount: 5000,
      status: "Draft",
    },
  ]);

  const [newExpense, setNewExpense] = useState({
    description: "",
    date: "",
    category: "",
    paidBy: "",
    remarks: "",
    amount: "",
  });

  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expense: Expense = {
      id: expenses.length + 1,
      employee: "Current User",
      description: newExpense.description,
      date: newExpense.date,
      category: newExpense.category,
      paidBy: newExpense.paidBy,
      remarks: newExpense.remarks,
      amount: parseFloat(newExpense.amount),
      status: "Draft",
    };
    setExpenses([...expenses, expense]);
    setNewExpense({ description: "", date: "", category: "", paidBy: "", remarks: "", amount: "" });
    toast({
      title: "Success",
      description: "Expense added successfully",
    });
  };

  const handleStatusChange = (id: number, newStatus: "Draft" | "Submitted") => {
    setExpenses(expenses.map(exp => exp.id === id ? { ...exp, status: newStatus } : exp));
    toast({
      title: "Status Updated",
      description: `Expense ${newStatus.toLowerCase()} successfully`,
    });
  };

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

      // simple regex to detect amount (₹1234 or 1234.00)
      const amountMatch = text.match(/(?:₹|INR)?\s?(\d+(?:\.\d{1,2})?)/);
      const extractedAmount = amountMatch ? amountMatch[1] : "0";

      const extractedData = {
        description: text.split("\n")[0] || "Receipt",
        date: new Date().toISOString().split("T")[0],
        category: "Other",
        paidBy: "Current User",
        remarks: text.substring(0, 100),
        amount: extractedAmount,
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

  const toSubmit = expenses.filter(e => e.status === "Draft").reduce((sum, e) => sum + e.amount, 0);
  const waitingApproval = expenses.filter(e => e.status === "Waiting Approval").reduce((sum, e) => sum + e.amount, 0);
  const approved = expenses.filter(e => e.status === "Approved").reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Employee's View
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload a receipt from your computer or take a photo. OCR will extract details to create a new expense entry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardDescription className="text-xs">To Submit</CardDescription>
              <CardTitle className="text-3xl font-bold text-orange-500">₹{toSubmit}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-blue-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full" />
            <CardHeader>
              <CardDescription className="text-xs">Waiting Approval</CardDescription>
              <CardTitle className="text-3xl font-bold text-blue-500">₹{waitingApproval}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardDescription className="text-xs">Approved</CardDescription>
              <CardTitle className="text-3xl font-bold text-green-500">₹{approved}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <Tabs defaultValue="expenses" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="new">
                  <Dialog>
                    <DialogTrigger asChild>
                      <span className="cursor-pointer">New Expense</span>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Expense</DialogTitle>
                        <DialogDescription>
                          Add a new expense manually or upload a receipt
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit}>
                        <div className="grid gap-6 py-4">
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
                                  <SelectItem value="Food">Food</SelectItem>
                                  <SelectItem value="Transport">Transport</SelectItem>
                                  <SelectItem value="Accommodation">Accommodation</SelectItem>
                                  <SelectItem value="Supplies">Supplies</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
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

                          <div className="space-y-2">
                            <Label htmlFor="amount">Amount (₹)</Label>
                            <Input
                              id="amount"
                              type="number"
                              value={newExpense.amount}
                              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="remarks">Remarks</Label>
                            <Textarea
                              id="remarks"
                              value={newExpense.remarks}
                              onChange={(e) => setNewExpense({ ...newExpense, remarks: e.target.value })}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="w-full">Save Expense</Button>
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
                        <TableHead>Employee</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Paid By</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell className="font-medium">{expense.employee}</TableCell>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell>{expense.date}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{expense.category}</Badge>
                          </TableCell>
                          <TableCell>{expense.paidBy}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{expense.remarks}</TableCell>
                          <TableCell className="text-right font-semibold">₹{expense.amount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                expense.status === "Approved"
                                  ? "default"
                                  : expense.status === "Draft"
                                  ? "outline"
                                  : "secondary"
                              }
                              className={
                                expense.status === "Approved"
                                  ? "bg-green-500/10 text-green-700 border-green-500/20"
                                  : expense.status === "Submitted"
                                  ? "bg-blue-500/10 text-blue-700 border-blue-500/20"
                                  : ""
                              }
                            >
                              {expense.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {expense.status === "Draft" && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(expense.id, "Submitted")}
                              >
                                Submit
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Employee;

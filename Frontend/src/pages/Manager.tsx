import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Expense {
  id: number;
  employee_name: string;
  description: string;
  date: string;
  category: string;
  paid_by: string;
  remarks: string;
  amount: number;
  status: "Submitted" | "Waiting Approval" | "Approved" | "Rejected";
}

const Manager = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Simulate fetching data
  useEffect(() => {
    setTimeout(() => {
      setExpenses([
        {
          id: 1,
          employee_name: "Sarah",
          description: "Team lunch",
          date: "2025-10-09",
          category: "Food",
          paid_by: "Sarah",
          remarks: "Restaurant bill",
          amount: 5000,
          status: "Submitted",
        },
        {
          id: 2,
          employee_name: "John",
          description: "Taxi fare",
          date: "2025-10-08",
          category: "Transport",
          paid_by: "John",
          remarks: "Client meeting",
          amount: 1200,
          status: "Waiting Approval",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = (id: number) => {
    setProcessingId(id);
    setTimeout(() => {
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === id ? { ...exp, status: "Approved" } : exp))
      );
      setProcessingId(null);
      toast({ title: "Success", description: "Expense approved successfully" });
    }, 500);
  };

  const handleReject = (id: number) => {
    setProcessingId(id);
    setTimeout(() => {
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === id ? { ...exp, status: "Rejected" } : exp))
      );
      setProcessingId(null);
      toast({ title: "Rejected", description: "Expense rejected" });
    }, 500);
  };

  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Manager's View
          </h1>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Approvals to Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Approval Subject</TableHead>
                    <TableHead>Request Owner</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Request Status</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No expenses to review
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenses.map((expense) => (
                      <TableRow key={expense.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.employee_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{expense.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              expense.status === "Approved"
                                ? "default"
                                : expense.status === "Rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {expense.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(expense.amount)}</TableCell>
                        <TableCell>
                          {(expense.status === "Submitted" || expense.status === "Waiting Approval") && (
                            <div className="flex gap-2 justify-center">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(expense.id)}
                                disabled={processingId === expense.id}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                {processingId === expense.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(expense.id)}
                                disabled={processingId === expense.id}
                              >
                                {processingId === expense.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject"}
                              </Button>
                            </div>
                          )}
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
    </div>
  );
};

export default Manager;

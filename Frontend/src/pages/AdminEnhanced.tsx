import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { mockUsers, mockCompany, mockApprovalRules, expenseCategories, userRoles } from "@/data/mockData";
import { Plus, Edit, Trash2, Users, Settings, Shield, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Approver {
  id: number;
  name: string;
  required: boolean;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  isActive: boolean;
  managerId?: string;
}

const AdminEnhanced = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("approval-rules");
  
  // Approval Rules State
  const [approvalRule, setApprovalRule] = useState({
    user: "",
    description: "Approval rule for miscellaneous expenses",
    manager: "",
    isManagerApprover: false,
    approversSequence: false,
    minApprovalPercentage: "",
  });
  
  const [approvers, setApprovers] = useState<Approver[]>([
    { id: 1, name: "John", required: true },
    { id: 2, name: "Mitchell", required: false },
    { id: 3, name: "Andreas", required: false },
  ]);

  // User Management State
  const [users, setUsers] = useState<User[]>(mockUsers || []);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE" as "ADMIN" | "MANAGER" | "EMPLOYEE",
    managerId: "",
  });

  // Company Settings State
  const [companySettings, setCompanySettings] = useState({
    approvalThreshold: 1000,
    requireManagerApproval: true,
    autoApprovalLimit: 100,
  });

  const [availableManagers] = useState(["sarah", "john", "mitchell"]);

  const toggleApproverRequired = (id: number) => {
    setApprovers(approvers.map(approver =>
      approver.id === id
        ? { ...approver, required: !approver.required }
        : approver
    ));
  };

  const handleSaveApprovalRule = async () => {
    try {
      setLoading(true);
      const ruleData = {
        name: approvalRule.description,
        description: approvalRule.description,
        conditions: {
          amountThreshold: 1000,
          categories: expenseCategories
        },
        approvalFlow: {
          type: approvalRule.approversSequence ? "SEQUENTIAL" : "PARALLEL",
          approvers: approvers.map(approver => ({
            userId: approver.id.toString(),
            order: approver.id,
            isRequired: approver.required
          }))
        },
        conditionalRules: {
          percentageApproval: parseInt(approvalRule.minApprovalPercentage) || 0,
          logic: "PERCENTAGE_OR_SPECIFIC"
        }
      };

      // In a real app, this would call the API
      // await apiService.createApprovalRule(ruleData);
      
      toast({
        title: "Success",
        description: "Approval rules saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save approval rules",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setLoading(true);
      const userData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        managerId: newUser.managerId || undefined
      };

      // In a real app, this would call the API
      // await apiService.createUser(userData);
      
      const createdUser: User = {
        _id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isActive: true,
        managerId: newUser.managerId || undefined
      };

      setUsers([...users, createdUser]);
      setNewUser({ name: "", email: "", password: "", role: "EMPLOYEE", managerId: "" });
      
      toast({
        title: "Success",
        description: "User created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCompanySettings = async () => {
    try {
      setLoading(true);
      // In a real app, this would call the API
      // await apiService.updateCompanySettings(companySettings);
      
      toast({
        title: "Success",
        description: "Company settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update company settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      setLoading(true);
      // In a real app, this would call the API
      // await apiService.deactivateUser(userId);
      
      setUsers(users.map(u => u._id === userId ? { ...u, isActive: false } : u));
      
      toast({
        title: "Success",
        description: "User deactivated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
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
              <h1 className="text-4xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground mt-2">Manage users, approval rules, and company settings</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                {user.role}
              </Badge>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="approval-rules" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Approval Rules
              </TabsTrigger>
              <TabsTrigger value="user-management" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="company-settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Company Settings
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Overview
              </TabsTrigger>
            </TabsList>

            {/* Approval Rules Tab */}
            <TabsContent value="approval-rules" className="mt-6">
              <Card className="shadow-xl border-border">
                <CardHeader>
                  <CardTitle>Configure Approval Rules</CardTitle>
                  <CardDescription>
                    Define managers, approvers, and sequence rules for expense requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="user">User</Label>
                        <Input
                          id="user"
                          value={approvalRule.user}
                          onChange={(e) => setApprovalRule({ ...approvalRule, user: e.target.value })}
                          className="font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description about rules</Label>
                        <Input
                          id="description"
                          value={approvalRule.description}
                          onChange={(e) => setApprovalRule({ ...approvalRule, description: e.target.value })}
                          placeholder="Enter approval rule description"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="manager">Manager:</Label>
                        <Select value={approvalRule.manager} onValueChange={(value) => setApprovalRule({ ...approvalRule, manager: value })}>
                          <SelectTrigger id="manager">
                            <SelectValue placeholder="Select a manager" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableManagers.map((mgr) => (
                              <SelectItem key={mgr} value={mgr}>
                                {mgr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-2">
                          Initially the manager set on user record should be set, admin can change manager if required.
                        </p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div className="flex items-start gap-3 mb-4">
                        <Checkbox
                          id="managerApprover"
                          checked={approvalRule.isManagerApprover}
                          onCheckedChange={(checked) => setApprovalRule({ ...approvalRule, isManagerApprover: checked as boolean })}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor="managerApprover" className="font-medium cursor-pointer">
                            Is manager an approver?
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            If checked, requests go to the manager first before other approvers.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 border-b pb-2">Approvers</h3>
                        <div className="space-y-3 mb-6">
                          {approvers.map((approver, index) => (
                            <div key={approver.id} className="flex items-center gap-4">
                              <span className="text-sm font-medium w-8">{index + 1}</span>
                              <div className="flex-1 flex items-center justify-between border-b pb-2">
                                <span className="font-medium">{approver.name}</span>
                                <div className="flex items-center gap-2">
                                  <Label
                                    htmlFor={`required-${approver.id}`}
                                    className="text-sm text-muted-foreground"
                                  >
                                    Required
                                  </Label>
                                  <Checkbox
                                    id={`required-${approver.id}`}
                                    checked={approver.required}
                                    onCheckedChange={() => toggleApproverRequired(approver.id)}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="approversSequence"
                            checked={approvalRule.approversSequence}
                            onCheckedChange={(checked) => setApprovalRule({ ...approvalRule, approversSequence: checked as boolean })}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <Label htmlFor="approversSequence" className="font-medium cursor-pointer">
                              Approvers Sequence
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              If checked, approvers must approve in order (John → Mitchell → Andreas).
                              If unchecked, requests go to all approvers simultaneously.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="minApproval">Minimum Approval Percentage</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="minApproval"
                            type="number"
                            min="0"
                            max="100"
                            value={approvalRule.minApprovalPercentage}
                            onChange={(e) => setApprovalRule({ ...approvalRule, minApprovalPercentage: e.target.value })}
                            placeholder="Enter percentage"
                            className="max-w-[200px]"
                          />
                          <span className="text-muted-foreground">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button onClick={handleSaveApprovalRule} size="lg" className="shadow-md" disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save Rules
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="user-management" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New User</CardTitle>
                    <CardDescription>Add a new user to the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newUserName">Name</Label>
                        <Input
                          id="newUserName"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newUserEmail">Email</Label>
                        <Input
                          id="newUserEmail"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newUserPassword">Password</Label>
                        <Input
                          id="newUserPassword"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          placeholder="Enter password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newUserRole">Role</Label>
                        <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value as "ADMIN" | "MANAGER" | "EMPLOYEE" })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {userRoles.map(role => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newUserManager">Manager (Optional)</Label>
                        <Select value={newUser.managerId} onValueChange={(value) => setNewUser({ ...newUser, managerId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select manager" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.filter(u => u.role === 'MANAGER').map(manager => (
                              <SelectItem key={manager._id} value={manager._id}>
                                {manager.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button onClick={handleCreateUser} disabled={loading} className="w-full">
                          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                          Create User
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage existing users in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Manager</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(users || []).map((user) => (
                          <TableRow key={user._id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.isActive ? "default" : "secondary"}>
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.managerId ? users.find(u => u._id === user.managerId)?.name || "Unknown" : "N/A"}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive"
                                  onClick={() => handleDeactivateUser(user._id)}
                                  disabled={loading}
                                >
                                  <Trash2 className="h-4 w-4" />
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
            </TabsContent>

            {/* Company Settings Tab */}
            <TabsContent value="company-settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Settings</CardTitle>
                  <CardDescription>Configure company-wide settings and policies</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="approvalThreshold">Approval Threshold (₹)</Label>
                        <Input
                          id="approvalThreshold"
                          type="number"
                          value={companySettings.approvalThreshold}
                          onChange={(e) => setCompanySettings({ ...companySettings, approvalThreshold: parseInt(e.target.value) })}
                        />
                        <p className="text-xs text-muted-foreground">Amount above which approval is required</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="autoApprovalLimit">Auto Approval Limit (₹)</Label>
                        <Input
                          id="autoApprovalLimit"
                          type="number"
                          value={companySettings.autoApprovalLimit}
                          onChange={(e) => setCompanySettings({ ...companySettings, autoApprovalLimit: parseInt(e.target.value) })}
                        />
                        <p className="text-xs text-muted-foreground">Amount below which expenses are auto-approved</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requireManagerApproval"
                        checked={companySettings.requireManagerApproval}
                        onCheckedChange={(checked) => setCompanySettings({ ...companySettings, requireManagerApproval: checked as boolean })}
                      />
                      <Label htmlFor="requireManagerApproval">Require Manager Approval</Label>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleUpdateCompanySettings} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Save Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{(users || []).length}</div>
                    <p className="text-sm text-muted-foreground">Active users in system</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{(users || []).filter(u => u.isActive).length}</div>
                    <p className="text-sm text-muted-foreground">Currently active</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Approval Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{mockApprovalRules.length}</div>
                    <p className="text-sm text-muted-foreground">Configured rules</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminEnhanced;

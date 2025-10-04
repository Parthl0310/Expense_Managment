// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";

// type Approver = {
//   id: number;
//   name: string;
//   required: boolean;
// };

// const Admin = () => {
//   const { toast } = useToast();
//   const [user, setUser] = useState("marc");
//   const [description, setDescription] = useState("Approval rule for miscellaneous expenses");
//   const [manager, setManager] = useState("sarah");
//   const [isManagerApprover, setIsManagerApprover] = useState(false);
//   const [approversSequence, setApproversSequence] = useState(false);
//   const [minApprovalPercentage, setMinApprovalPercentage] = useState("");
  
//   const [approvers, setApprovers] = useState<Approver[]>([
//     { id: 1, name: "John", required: true },
//     { id: 2, name: "Mitchell", required: false },
//     { id: 3, name: "Andreas", required: false },
//   ]);

//   const [availableManagers] = useState(["sarah", "john", "mitchell"]);

//   const toggleApproverRequired = (id: number) => {
//     setApprovers(approvers.map(approver => 
//       approver.id === id 
//         ? { ...approver, required: !approver.required }
//         : approver
//     ));
//   };

//   const handleSave = () => {
//     toast({
//       title: "Success",
//       description: "Approval rules saved successfully (Frontend only)",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background p-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8">Admin view (Approval rules)</h1>
        
//         <Card>
//           <CardContent className="pt-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//               {/* Left Column */}
//               <div className="space-y-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="user">User</Label>
//                   <Input
//                     id="user"
//                     value={user}
//                     onChange={(e) => setUser(e.target.value)}
//                     className="font-medium"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description about rules</Label>
//                   <Input
//                     id="description"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     placeholder="Enter approval rule description"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="manager">Manager:</Label>
//                   <Select value={manager} onValueChange={setManager}>
//                     <SelectTrigger id="manager">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {availableManagers.map((mgr) => (
//                         <SelectItem key={mgr} value={mgr}>
//                           {mgr}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <p className="text-xs text-muted-foreground mt-2">
//                     Initially the manager set on user record should be set, admin can change manager for approval if required.
//                   </p>
//                 </div>
//               </div>

//               {/* Right Column */}
//               <div className="space-y-6">
//                 <div>
//                   <div className="flex items-start gap-3 mb-4">
//                     <Checkbox
//                       id="managerApprover"
//                       checked={isManagerApprover}
//                       onCheckedChange={(checked) => setIsManagerApprover(checked as boolean)}
//                       className="mt-1"
//                     />
//                     <div className="flex-1">
//                       <Label htmlFor="managerApprover" className="font-medium cursor-pointer">
//                         Is manager an approver?
//                       </Label>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         If this field is checked then by default the approve request would go to his/her manager first, before going to other approvers.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-semibold mb-4 border-b pb-2">Approvers</h3>
                  
//                   <div className="space-y-3 mb-6">
//                     {approvers.map((approver, index) => (
//                       <div key={approver.id} className="flex items-center gap-4">
//                         <span className="text-sm font-medium w-8">{index + 1}</span>
//                         <div className="flex-1 flex items-center justify-between border-b pb-2">
//                           <span className="font-medium">{approver.name}</span>
//                           <div className="flex items-center gap-2">
//                             <Label htmlFor={`required-${approver.id}`} className="text-sm text-muted-foreground">
//                               Required
//                             </Label>
//                             <Checkbox
//                               id={`required-${approver.id}`}
//                               checked={approver.required}
//                               onCheckedChange={() => toggleApproverRequired(approver.id)}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <p className="text-xs text-muted-foreground mb-4">
//                     If the field is ticked then another approval of this approver is required in any approval confirmation scenario.
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-start gap-3">
//                     <Checkbox
//                       id="approversSequence"
//                       checked={approversSequence}
//                       onCheckedChange={(checked) => setApproversSequence(checked as boolean)}
//                       className="mt-1"
//                     />
//                     <div className="flex-1">
//                       <Label htmlFor="approversSequence" className="font-medium cursor-pointer">
//                         Approvers Sequence:
//                       </Label>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         If this field is ticked true then the above mentioned sequence of approvers matters, 
//                         that is first the request goes to John, if he approves/rejects then only request goes 
//                         to mitchell and so on.
//                       </p>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         If the required approver rejects the request, then expense request is auto-rejected.
//                       </p>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         If not ticked then send approver request to all approvers at the same time.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="minApproval">Minimum Approval percentage:</Label>
//                   <div className="flex items-center gap-2">
//                     <Input
//                       id="minApproval"
//                       type="number"
//                       min="0"
//                       max="100"
//                       value={minApprovalPercentage}
//                       onChange={(e) => setMinApprovalPercentage(e.target.value)}
//                       placeholder="Enter percentage"
//                       className="max-w-[200px]"
//                     />
//                     <span className="text-muted-foreground">%</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 flex justify-end">
//               <Button onClick={handleSave} size="lg">
//                 Save Rules
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Admin;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

type Approver = {
  id: number;
  name: string;
  required: boolean;
};

const Admin = () => {
  const { toast } = useToast();
  const [user, setUser] = useState("marc");
  const [description, setDescription] = useState("Approval rule for miscellaneous expenses");
  const [manager, setManager] = useState("sarah");
  const [isManagerApprover, setIsManagerApprover] = useState(false);
  const [approversSequence, setApproversSequence] = useState(false);
  const [minApprovalPercentage, setMinApprovalPercentage] = useState("");

  const [approvers, setApprovers] = useState<Approver[]>([
    { id: 1, name: "John", required: true },
    { id: 2, name: "Mitchell", required: false },
    { id: 3, name: "Andreas", required: false },
  ]);

  const [availableManagers] = useState(["sarah", "john", "mitchell"]);

  const toggleApproverRequired = (id: number) => {
    setApprovers(approvers.map(approver =>
      approver.id === id
        ? { ...approver, required: !approver.required }
        : approver
    ));
  };

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Approval rules saved successfully (Frontend only)",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar is now handled by the Layout component */}

      <section className="py-20 px-4 bg-background flex-1">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-8">Admin Panel – Approval Rules</h1>

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
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                      className="font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description about rules</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter approval rule description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manager">Manager:</Label>
                    <Select value={manager} onValueChange={setManager}>
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
                      checked={isManagerApprover}
                      onCheckedChange={(checked) => setIsManagerApprover(checked as boolean)}
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
                        checked={approversSequence}
                        onCheckedChange={(checked) => setApproversSequence(checked as boolean)}
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
                        value={minApprovalPercentage}
                        onChange={(e) => setMinApprovalPercentage(e.target.value)}
                        placeholder="Enter percentage"
                        className="max-w-[200px]"
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button onClick={handleSave} size="lg" className="shadow-md">
                  Save Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;

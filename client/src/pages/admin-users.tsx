import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, MoreVertical, Mail, Calendar, UserCog, Search, Users, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminUsers() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Fetch users
  const { 
    data: users, 
    isLoading, 
    isError 
  } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  // Handle view details
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };
  
  // Format date
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Filter users by search query
  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-heading">
            Manage Users
          </h1>
        </div>
        
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 ml-auto">
                <Button variant="outline">
                  Export Users
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <div className="bg-destructive/10 text-destructive p-4 m-4 rounded-md">
                <p>Error loading users. Please try again later.</p>
              </div>
            ) : filteredUsers && filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                              <div className="text-sm text-muted-foreground">@{user.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.isAdmin ? "secondary" : "outline"}>
                            {user.isAdmin ? "Admin" : "Customer"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                                <UserCog className="mr-2 h-4 w-4" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Send Email</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                {user.isAdmin ? (
                                  <>
                                    <Shield className="mr-2 h-4 w-4" />
                                    <span>Remove Admin</span>
                                  </>
                                ) : (
                                  <>
                                    <Shield className="mr-2 h-4 w-4" />
                                    <span>Make Admin</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No users found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? "No users match your search criteria" 
                    : "There are no users registered yet"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View comprehensive information about this user.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-semibold mb-2">
                  {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <p className="text-muted-foreground">@{selectedUser.username}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground mr-2">Email:</span>
                  <span>{selectedUser.email}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground mr-2">Joined:</span>
                  <span>{formatDate(selectedUser.createdAt)}</span>
                </div>
                
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground mr-2">Role:</span>
                  <Badge variant={selectedUser.isAdmin ? "secondary" : "outline"}>
                    {selectedUser.isAdmin ? "Admin" : "Customer"}
                  </Badge>
                </div>
                
                {selectedUser.phoneNumber && (
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">Phone:</span>
                    <span>{selectedUser.phoneNumber}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    View Bookings
                  </Button>
                  <Button variant="outline" size="sm">
                    Send Email
                  </Button>
                  <Button variant="outline" size="sm">
                    Reset Password
                  </Button>
                  {selectedUser.isAdmin ? (
                    <Button variant="outline" size="sm">
                      Remove Admin Role
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      Make Admin
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

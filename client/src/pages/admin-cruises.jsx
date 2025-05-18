import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Cruise, insertCruiseSchema } from "./shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@react-hook-form";
import { apiRequest, queryClient } from "./lib/queryClient";
import { useToast } from "./hooks/use-toast";
import { Button } from "../Components/ui/button";
import { Input } from "../Components/ui/input";
import { Textarea } from "../Components/ui/textarea";
import { Card, CardContent } from "./Components/ui/card";
import { Toggle } from "../Components/ui/toggle";
import { Separator } from "../Components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../Components/ui/table";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "../Components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../Components/ui/dropdown-menu";
import { Loader2, PenSquare, Trash2, MoreVertical, Plus, Search, Ship, Eye } from "lucide-react";

export default function AdminCruises() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCruise, setSelectedCruise] = useState<Cruise | null>(null);
  
 // Fetch cruises
const { 
  data: cruises, 
  isLoading, 
  isError 
} = useQuery({
  queryKey: ["/api/cruises"],
});

// Add cruise mutation
const addCruiseMutation = useMutation({
  mutationFn: async (data) => {
    const res = await apiRequest("POST", "/api/cruises", data);
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/cruises"] });
    toast({
      title: "Success",
      description: "Cruise added successfully",
    });
    setIsAddDialogOpen(false);
  },
  onError: (error) => {
    toast({
      title: "Error",
      description: `Failed to add cruise: ${error.message}`,
      variant: "destructive",
    });
  },
});

// Edit cruise mutation
const editCruiseMutation = useMutation({
  mutationFn: async (data) => {
    const res = await apiRequest("PUT", `/api/cruises/${data.id}`, data.cruiseData);
    return res.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/cruises"] });
    toast({
      title: "Success",
      description: "Cruise updated successfully",
    });
    setIsEditDialogOpen(false);
  },
  onError: (error) => {
    toast({
      title: "Error",
      description: `Failed to update cruise: ${error.message}`,
      variant: "destructive",
    });
  },
});

// Delete cruise mutation
const deleteCruiseMutation = useMutation({
  mutationFn: async (id) => {
    await apiRequest("DELETE", `/api/cruises/${id}`);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/cruises"] });
    toast({
      title: "Success",
      description: "Cruise deleted successfully",
    });
    setIsDeleteDialogOpen(false);
  },
  onError: (error) => {
    toast({
      title: "Error",
      description: `Failed to delete cruise: ${error.message}`,
      variant: "destructive",
    });
  },
});

// Create form
const addForm = useForm({
  resolver: zodResolver(insertCruiseSchema),
  defaultValues: {
    name: "",
    description: "",
    departureLocation: "",
    destinationLocation: "",
    duration: 7,
    basePrice: 999,
    taxesFees: 199,
    gratuities: 99,
    image: "https://images.unsplash.com/photo-1548574505-5e239809ee19",
    rating: 0,
    reviewCount: 0,
    isActive: true,
    departureOptions: ["2025-06-15", "2025-07-05", "2025-07-25"]
  },
});

// Edit form
const editForm = useForm({
  resolver: zodResolver(insertCruiseSchema),
  defaultValues: {
    name: "",
    description: "",
    departureLocation: "",
    destinationLocation: "",
    duration: 7,
    basePrice: 999,
    taxesFees: 199,
    gratuities: 99,
    image: "",
    rating: 0,
    reviewCount: 0,
    isActive: true,
    departureOptions: []
  },
});

// Handle add form submission
const onAddSubmit = (data) => {
  addCruiseMutation.mutate(data);
};

// Handle edit form submission
const onEditSubmit = (data) => {
  if (selectedCruise) {
    editCruiseMutation.mutate({ id: selectedCruise.id, cruiseData: data });
  }
};

// Handle delete confirmation
const confirmDelete = () => {
  if (selectedCruise) {
    deleteCruiseMutation.mutate(selectedCruise.id);
  }
};

// Handle edit button click
const handleEditClick = (cruise) => {
  setSelectedCruise(cruise);

  // Reset form with cruise data
  editForm.reset({
    name: cruise.name,
    description: cruise.description,
    departureLocation: cruise.departureLocation,
    destinationLocation: cruise.destinationLocation,
    duration: cruise.duration,
    basePrice: cruise.basePrice,
    taxesFees: cruise.taxesFees,
    gratuities: cruise.gratuities,
    image: cruise.image,
    rating: cruise.rating,
    reviewCount: cruise.reviewCount,
    isActive: cruise.isActive,
    departureOptions: cruise.departureOptions
  });

  setIsEditDialogOpen(true);
};

// Handle delete button click
const handleDeleteClick = (cruise) => {
  setSelectedCruise(cruise);
  setIsDeleteDialogOpen(true);
};

// Filter cruises by search query
const filteredCruises = cruises?.filter(cruise => 
  cruise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  cruise.departureLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
  cruise.destinationLocation.toLowerCase().includes(searchQuery.toLowerCase())
);

  
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-heading">
            Manage Cruises
          </h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Cruise
          </Button>
        </div>
        
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cruises..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Toggle aria-label="Show active cruises only" pressed={true}>
                  Active
                </Toggle>
                <Toggle aria-label="Show inactive cruises">
                  Inactive
                </Toggle>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Cruises Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <div className="bg-destructive/10 text-destructive p-4 m-4 rounded-md">
                <p>Error loading cruises. Please try again later.</p>
              </div>
            ) : filteredCruises && filteredCruises.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Base Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCruises.map((cruise) => (
                      <TableRow key={cruise.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded overflow-hidden mr-3">
                              <img 
                                src={cruise.image} 
                                alt={cruise.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="font-medium">{cruise.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {cruise.departureLocation} to {cruise.destinationLocation}
                        </TableCell>
                        <TableCell>{cruise.duration} days</TableCell>
                        <TableCell>${cruise.basePrice}</TableCell>
                        <TableCell>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                            cruise.isActive 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {cruise.isActive ? "Active" : "Inactive"}
                          </div>
                        </TableCell>
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
                              <Link href={`/cruises/${cruise.id}`}>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>View</span>
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuItem onClick={() => handleEditClick(cruise)}>
                                <PenSquare className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteClick(cruise)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
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
                <Ship className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No cruises found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? "No cruises match your search criteria" 
                    : "There are no cruises available yet"
                  }
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  Add Your First Cruise
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add Cruise Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Cruise</DialogTitle>
            <DialogDescription>
              Add a new cruise package to your offerings.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cruise Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Caribbean Paradise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="departureLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Miami" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="destinationLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="Bahamas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Days)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-8">
                      <FormControl>
                        <div className="flex h-6 items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span>Active</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={addForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Enter cruise description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={addForm.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="taxesFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxes & Fees ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="gratuities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gratuities ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={addForm.control}
                name="departureOptions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Dates (comma-separated)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="2025-06-15, 2025-07-05, 2025-07-25" 
                        value={Array.isArray(field.value) ? field.value.join(", ") : field.value} 
                        onChange={(e) => {
                          const dates = e.target.value.split(",").map(date => date.trim());
                          field.onChange(dates);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter dates in YYYY-MM-DD format, separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addCruiseMutation.isPending}
                >
                  {addCruiseMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : "Add Cruise"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Cruise Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Cruise</DialogTitle>
            <DialogDescription>
              Update the details of {selectedCruise?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              {/* Same form fields as Add Cruise Dialog */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cruise Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Caribbean Paradise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="departureLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Miami" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="destinationLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="Bahamas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Days)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-8">
                      <FormControl>
                        <div className="flex h-6 items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span>Active</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Enter cruise description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={editForm.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="taxesFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxes & Fees ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="gratuities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gratuities ($)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="departureOptions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Dates (comma-separated)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="2025-06-15, 2025-07-05, 2025-07-25" 
                        value={Array.isArray(field.value) ? field.value.join(", ") : field.value} 
                        onChange={(e) => {
                          const dates = e.target.value.split(",").map(date => date.trim());
                          field.onChange(dates);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter dates in YYYY-MM-DD format, separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={editCruiseMutation.isPending}
                >
                  {editCruiseMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : "Update Cruise"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the cruise "{selectedCruise?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted p-4 rounded-md">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded overflow-hidden mr-3">
                <img 
                  src={selectedCruise?.image} 
                  alt={selectedCruise?.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">{selectedCruise?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedCruise?.departureLocation} to {selectedCruise?.destinationLocation}
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteCruiseMutation.isPending}
            >
              {deleteCruiseMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Delete Cruise"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

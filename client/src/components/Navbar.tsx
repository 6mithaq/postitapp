import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Ship, BarChart3 } from "lucide-react";

const Navbar = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path ? "border-primary-light text-primary" : "border-transparent text-text-secondary hover:border-secondary hover:text-secondary";
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-primary font-heading font-bold text-xl cursor-pointer">
                  Ocean<span className="text-secondary">Cruises</span>
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive("/")}`}>
                  Home
                </a>
              </Link>
              <Link href="/cruises">
                <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive("/cruises")}`}>
                  Cruises
                </a>
              </Link>
              {user && (
                <Link href="/dashboard">
                  <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive("/dashboard")}`}>
                    My Bookings
                  </a>
                </Link>
              )}
              {user?.isAdmin && (
                <Link href="/admin">
                  <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive("/admin")}`}>
                    Admin
                  </a>
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>My Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  {user.isAdmin && (
                    <Link href="/admin">
                      <DropdownMenuItem>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <a className="px-3 py-2 text-sm text-text-secondary hover:text-primary font-medium">
                    Sign In
                  </a>
                </Link>
                <Link href="/auth?tab=register">
                  <a className="px-4 py-2 text-sm text-white bg-primary hover:bg-primary-light rounded-md font-medium transition-colors">
                    Register
                  </a>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-text-secondary">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="sm:max-w-sm">
                <div className="flex flex-col px-2 pt-2 pb-3 space-y-1">
                  <Link href="/">
                    <a 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${location === "/" ? "bg-primary text-white" : "text-foreground hover:bg-background"}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </a>
                  </Link>
                  <Link href="/cruises">
                    <a 
                      className={`block px-3 py-2 rounded-md text-base font-medium ${location === "/cruises" ? "bg-primary text-white" : "text-foreground hover:bg-background"}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Cruises
                    </a>
                  </Link>
                  {user && (
                    <Link href="/dashboard">
                      <a 
                        className={`block px-3 py-2 rounded-md text-base font-medium ${location === "/dashboard" ? "bg-primary text-white" : "text-foreground hover:bg-background"}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Bookings
                      </a>
                    </Link>
                  )}
                  {user?.isAdmin && (
                    <Link href="/admin">
                      <a 
                        className={`block px-3 py-2 rounded-md text-base font-medium ${location === "/admin" ? "bg-primary text-white" : "text-foreground hover:bg-background"}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin Panel
                      </a>
                    </Link>
                  )}
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    {user ? (
                      <>
                        <div className="flex items-center px-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-base font-medium text-foreground">{user.firstName} {user.lastName}</div>
                            <div className="text-sm font-medium text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start px-3 py-2 text-base font-medium text-red-600"
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="mt-3 space-y-1">
                        <Link href="/auth">
                          <a 
                            className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-background"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Sign In
                          </a>
                        </Link>
                        <Link href="/auth?tab=register">
                          <a
                            className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Register
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

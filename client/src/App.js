import React from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
//import { Toaster } from "../Components/ui/toaster";

import Toaster from './Components/ui/toaster';
//import Tooltip from './Components/ui/tooltip';
import NotFound from './pages/not-found';
import HomePage from './pages/home-page';

import { TooltipProvider } from "../Components/ui/tooltip";

//import NotFound from "../pages/not-found";
//import HomePage from "../pages/home-page";
import AuthPage from "../pages/auth-page";
import CruisesPage from "../pages/cruises-page";
import CruiseDetailsPage from "../pages/cruise-details-page";
import CustomerDashboard from "../pages/customer-dashboard";
import AdminDashboard from "../pages/admin-dashboard";
import AdminCruises from "../pages/admin-cruises";
import AdminUsers from "../pages/admin-users";
import AdminBookings from "../pages/admin-bookings";

import { ProtectedRoute, AdminRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/cruises" component={CruisesPage} />
      <Route path="/cruises/:id" component={CruiseDetailsPage} />

      {/* Protected routes */}
      <ProtectedRoute path="/dashboard" component={CustomerDashboard} />

      {/* Admin routes */}
      <AdminRoute path="/admin" component={AdminDashboard} />
      <AdminRoute path="/admin/cruises" component={AdminCruises} />
      <AdminRoute path="/admin/users" component={AdminUsers} />
      <AdminRoute path="/admin/bookings" component={AdminBookings} />

      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}



export default App;

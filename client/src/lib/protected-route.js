import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { Route, useLocation } from "wouter";
import '../index.css';


// Protected route component for regular users
export function ProtectedRoute({ path, component: Component }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  return user ? <Route path={path} component={Component} /> : null;
}

// Protected route component for admin users
export function AdminRoute({ path, component: Component }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!user.isAdmin) {
        navigate("/");
      }
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  return user?.isAdmin ? <Route path={path} component={Component} /> : null;
}

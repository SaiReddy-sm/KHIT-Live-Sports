import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("adminAuth");

  const isAuthenticated =
    token &&
    token !== "null" &&
    token !== "undefined" &&
    token.trim() !== "";

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
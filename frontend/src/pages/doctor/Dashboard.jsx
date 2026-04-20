import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-card p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-border">
        <h1 className="text-3xl font-bold text-primary mb-4">Doctor Portal</h1>
        <p className="text-muted-foreground mb-8">Welcome back, Doctor. Your dashboard is being prepared.</p>
        <Button onClick={handleLogout} variant="outline" className="w-full">Logout</Button>
      </div>
    </div>
  );
};

export default DoctorDashboard;

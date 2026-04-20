import React from "react";

const AdminDashboard = () => {
  return (
    <div className="flex-1 bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-card p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-border">
        <h1 className="text-3xl font-bold text-primary mb-4">Admin Portal</h1>
        <p className="text-muted-foreground">Welcome back, Admin. System management is ready.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;


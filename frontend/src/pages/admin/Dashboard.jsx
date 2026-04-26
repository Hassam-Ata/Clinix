import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminOverview,
  useAdminRevenue,
} from "@/hooks/useAdmin";
import { AlertCircle, DollarSign, Users, Calendar } from "lucide-react";

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Skeleton className="h-32" />
    <Skeleton className="h-32" />
    <Skeleton className="h-32" />
    <Skeleton className="h-32" />
  </div>
);

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const { data: overview, isLoading } = useAdminOverview();
  const { data: revenue, isLoading: revenueLoading } = useAdminRevenue();

  if (isLoading || revenueLoading) {
    return (
      <div className="flex-1 flex flex-col p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and analytics</p>
        </div>
        <SkeletonLoader />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Doctors",
      value: overview?.totalDoctors || 0,
      icon: Users,
      description: "Active and pending doctors",
    },
    {
      title: "Pending Approvals",
      value: overview?.pendingDoctors || 0,
      icon: AlertCircle,
      description: "Awaiting review",
    },
    {
      title: "Total Appointments",
      value: overview?.totalAppointments || 0,
      icon: Calendar,
      description: "All platform appointments",
    },
    {
      title: "Total Revenue",
      value: revenue?.totalRevenue ? `$${(revenue.totalRevenue)}` : "$0.00",
      icon: DollarSign,
      description: "Platform earnings",
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 opacity-50" />
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;


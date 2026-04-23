import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAppointments, useAdminOverview } from "@/hooks/useAdmin";
import { Calendar } from "lucide-react";

// Skeleton Loader
const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="h-20" />
    ))}
  </div>
);

const AppointmentsPage = () => {
  const { data: appointmentStats, isLoading } = useAdminAppointments();
  const { data: overview, isLoading: overviewLoading } = useAdminOverview();

  if (isLoading || overviewLoading) {
    return (
      <div className="flex-1 flex flex-col p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">View platform appointment breakdown and totals</p>
        </div>
        <SkeletonLoader />
      </div>
    );
  }

  const appointmentsByStatus = {
    PENDING: appointmentStats?.pending || 0,
    ACCEPTED: appointmentStats?.accepted || 0,
    REJECTED: appointmentStats?.rejected || 0,
    COMPLETED: appointmentStats?.completed || 0,
  };

  const totalAppointments = overview?.totalAppointments || Object.values(appointmentsByStatus).reduce((sum, value) => sum + value, 0);

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p className="text-muted-foreground">View platform appointment breakdown and totals</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(appointmentsByStatus).map(([status, appts]) => (
          <Card key={status}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{status}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appts}</div>
              <p className="text-xs text-muted-foreground mt-1">{appts} appointment{appts !== 1 ? 's' : ''}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Appointment Overview
          </CardTitle>
          <CardDescription>
            Total appointments across all states: {totalAppointments}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(appointmentsByStatus).map(([status, count]) => (
              <div key={status} className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{status}</p>
                <p className="mt-2 text-3xl font-bold">{count}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {status === "PENDING" && "Awaiting doctor response"}
                  {status === "ACCEPTED" && "Confirmed by doctor"}
                  {status === "REJECTED" && "Rejected by doctor"}
                  {status === "COMPLETED" && "Finished appointments"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {totalAppointments === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <p className="text-center text-muted-foreground text-lg">No appointments found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppointmentsPage;

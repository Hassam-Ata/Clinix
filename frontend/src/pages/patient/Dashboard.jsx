import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import api from "@/api/axios";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const STATUS_BADGE_CLASS = {
  PAID: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  FAILED: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
};

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const PatientDashboard = () => {
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useQuery({
    queryKey: ["patient-dashboard-summary"],
    queryFn: async () => {
      const response = await api.get("/patient/dashboard/summary");
      return response.data;
    },
  });

  const {
    data: spending,
    isLoading: isSpendingLoading,
    isError: isSpendingError,
  } = useQuery({
    queryKey: ["patient-dashboard-spending"],
    queryFn: async () => {
      const response = await api.get("/patient/dashboard/spending");
      return response.data;
    },
  });

  const {
    data: payments = [],
    isLoading: isPaymentsLoading,
    isError: isPaymentsError,
  } = useQuery({
    queryKey: ["patient-dashboard-payments"],
    queryFn: async () => {
      const response = await api.get("/patient/dashboard/payments");
      return response.data;
    },
  });

  const paymentStatusStats = useMemo(() => {
    const counts = payments.reduce((acc, payment) => {
      const key = payment.status || "UNKNOWN";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      percentage: payments.length > 0 ? Math.round((count / payments.length) * 100) : 0,
    }));
  }, [payments]);

  if (isSummaryError || isSpendingError || isPaymentsError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Unable to load dashboard data</CardTitle>
            <CardDescription>Please refresh and try again.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Patient Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your appointments, spending, and payment activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Appointments"
          value={summary?.totalAppointments}
          loading={isSummaryLoading}
        />
        <MetricCard
          title="Upcoming Appointments"
          value={summary?.upcomingAppointments}
          loading={isSummaryLoading}
        />
        <MetricCard
          title="Completed Appointments"
          value={summary?.completedAppointments}
          loading={isSummaryLoading}
        />
        <MetricCard
          title="Total Spent"
          value={spending?.totalSpent}
          loading={isSpendingLoading}
          isCurrency
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending Snapshot</CardTitle>
            <CardDescription>Based on your payment activity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSpendingLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-semibold mt-1">{CURRENCY_FORMATTER.format(spending?.totalSpent || 0)}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Total Payments</p>
                  <p className="text-2xl font-semibold mt-1">{spending?.totalPayments || 0}</p>
                </div>
                <div className="space-y-2 pt-2">
                  <p className="text-sm font-medium">Average per payment</p>
                  <p className="text-xl font-semibold">
                    {CURRENCY_FORMATTER.format(
                      spending?.totalPayments > 0 ? (spending.totalSpent || 0) / spending.totalPayments : 0,
                    )}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3" size="">
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
            <CardDescription>Chart view of your payment outcomes.</CardDescription>
          </CardHeader>
          <CardContent>
            {isPaymentsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : paymentStatusStats.length > 0 ? (
              <div className="space-y-4">
                {paymentStatusStats.map((item) => (
                  <div key={item.status} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.status}</span>
                      <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No payments yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Transactions from your consultations.</CardDescription>
        </CardHeader>
        <CardContent>
          {isPaymentsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Appointment Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.appointment?.doctor?.user?.name || "-"}</TableCell>
                    <TableCell>
                      {(payment.appointment?.doctor?.specialization || "-").replaceAll("_", " ")}
                    </TableCell>
                    <TableCell>
                      {payment.appointment?.startTime
                        ? format(new Date(payment.appointment.startTime), "MMM d, yyyy h:mm a")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={STATUS_BADGE_CLASS[payment.status] || "bg-muted text-muted-foreground border-border"}
                      >
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {CURRENCY_FORMATTER.format(payment.amount || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">No payment records found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const MetricCard = ({ title, value, loading, isCurrency = false }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent >
        {loading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <p className="text-2xl font-semibold">
            {isCurrency ? CURRENCY_FORMATTER.format(value || 0) : value ?? 0}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientDashboard;


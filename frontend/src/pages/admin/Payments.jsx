import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminPayments, useAdminRevenue } from "@/hooks/useAdmin";
import { DollarSign, TrendingUp } from "lucide-react";

// Skeleton Loader
const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="h-20" />
    ))}
  </div>
);

const PaymentsPage = () => {
  const { data: paymentStats, isLoading } = useAdminPayments();
  const { data: revenue, isLoading: revenueLoading } = useAdminRevenue();

  if (isLoading || revenueLoading) {
    return (
      <div className="flex-1 flex flex-col p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">View payment transactions and revenue</p>
        </div>
        <SkeletonLoader />
      </div>
    );
  }

  const pendingPayments = paymentStats?.pending || 0;
  const paidPayments = paymentStats?.paid || 0;
  const failedPayments = paymentStats?.failed || 0;
  const totalPayments = pendingPayments + paidPayments + failedPayments;
  const totalRevenue = revenue?.totalRevenue || 0;
  const platformCut = revenue?.platformCut || 0;
  const doctorPayouts = revenue?.doctorPayouts || 0;

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">Track payment status breakdown and platform revenue</p>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(totalRevenue / 100).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">PAID payments only</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Platform Cut
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(platformCut / 100).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">20% of collected revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Doctor Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(doctorPayouts / 100).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">80% of collected revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingPayments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{paidPayments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{failedPayments}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>{totalPayments} total payment records returned by the admin dashboard endpoint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending</p>
              <p className="mt-2 text-2xl font-bold">{pendingPayments}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Paid</p>
              <p className="mt-2 text-2xl font-bold">{paidPayments}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Failed</p>
              <p className="mt-2 text-2xl font-bold">{failedPayments}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;

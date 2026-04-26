import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminPayments, useAdminRevenue } from "@/hooks/useAdmin";
import { ChartColumn, PieChart } from "lucide-react";

// Skeleton Loader
const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="h-20" />
    ))}
  </div>
);

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);

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
  const safeTotalPayments = totalPayments || 1;
  const maxPaymentBucket = Math.max(pendingPayments, paidPayments, failedPayments, 1);

  const paymentChartData = [
    { label: "Pending", value: pendingPayments, color: "bg-amber-500", lightBg: "bg-amber-500/15" },
    { label: "Paid", value: paidPayments, color: "bg-emerald-500", lightBg: "bg-emerald-500/15" },
    { label: "Failed", value: failedPayments, color: "bg-rose-500", lightBg: "bg-rose-500/15" },
  ];

  const platformPercent = totalRevenue ? Math.round((platformCut / totalRevenue) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">Visual analytics for payment status and revenue distribution</p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartColumn className="h-4 w-4" />
              Payment Status Chart
            </CardTitle>
            <CardDescription>{totalPayments} total payment records, grouped by status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentChartData.map((item) => {
                const width = (item.value / maxPaymentBucket) * 100;
                const share = Math.round((item.value / safeTotalPayments) * 100);

                return (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-muted-foreground">{item.value} ({share}%)</span>
                    </div>
                    <div className={`h-3 w-full overflow-hidden rounded-full ${item.lightBg}`}>
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Revenue Split
            </CardTitle>
            <CardDescription>Platform share vs doctor payout from paid payment revenue.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div
                className="relative h-36 w-36 rounded-full"
                style={{
                  background: `conic-gradient(rgb(59 130 246) ${platformPercent}%, rgb(16 185 129) 0%)`,
                }}
                aria-label="Revenue split chart"
              >
                <div className="absolute inset-5 rounded-full bg-background" />
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-blue-600">Platform Cut ({platformPercent}%)</p>
                  <p className="text-muted-foreground">{formatCurrency(platformCut)}</p>
                </div>
                <div>
                  <p className="font-medium text-emerald-600">Doctor Payouts ({100 - platformPercent}%)</p>
                  <p className="text-muted-foreground">{formatCurrency(doctorPayouts)}</p>
                </div>
                <p className="text-xs text-muted-foreground">Total revenue: {formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentsPage;

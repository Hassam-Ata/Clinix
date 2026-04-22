import React from "react";
import { useDoctorProfile } from "@/hooks/useDoctor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Briefcase, DollarSign, Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { data } from "react-router";

import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { data: doctor, isLoading, error } = useDoctorProfile();
  
  React.useEffect(() => {
    if (doctor && !doctor.specialization) {
      navigate("/doctor/onboard");
    }
  }, [doctor, navigate]);

  console.log(doctor)


  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 col-span-1 md:col-span-2" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold">Failed to load profile</h2>
          <p className="text-muted-foreground">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  const isPending = doctor.status === "PENDING";

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <Card className="relative w-full max-w-lg border-primary/20 bg-background/60 backdrop-blur-xl shadow-2xl">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <Clock className="h-8 w-8 text-primary animate-spin-slow" />
                    </div>
                    <CardTitle className="text-3xl font-bold">Application Pending</CardTitle>
                    <CardDescription className="text-lg">
                        Your professional profile is currently under review.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6 pt-4">
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Our administration team is verifying your credentials and documentation. 
                            This process usually takes 24-48 hours. We'll notify you once your account is activated.
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-sm px-2">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">
                                Pending Approval
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm px-2">
                            <span className="text-muted-foreground">Application Date</span>
                            <span className="font-medium">{new Date(doctor.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground italic">
                        Need help? Contact us at support@clinix.com
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  // Approved State - Profile Overview
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Doctor Dashboard</h1>
          <p className="text-muted-foreground text-lg">Welcome back, Dr. {doctor.user.name}</p>
        </div>
        <Badge variant="outline" className="w-fit px-4 py-1 border-primary/50 text-primary bg-primary/5 text-sm font-medium">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Verified Professional
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-xl bg-gradient-to-br from-card to-background">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Professional Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</span>
                  <div className="flex items-center gap-3 text-lg font-medium">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {doctor.user.name}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Specialization</span>
                  <div className="flex items-center gap-3 text-lg font-medium">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="secondary" className="font-semibold text-primary">{doctor.specialization}</Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</span>
                  <div className="flex items-center gap-3 text-lg font-medium">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {doctor.user.email}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Consultation Fees</span>
                  <div className="flex items-center gap-3 text-2xl font-bold text-primary">
                    <DollarSign className="h-5 w-5" />
                    {doctor.fees}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Member Since</span>
                  <div className="flex items-center gap-3 text-lg font-medium">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(doctor.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </div>
                </div>

                <div className="pt-4">
                    <a 
                        href={doctor.documentUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                        View Verification Documents
                    </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats / Actions */}
        <div className="space-y-6">
            <Card className="border-primary/10 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg">Account Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-medium">Active Slots</span>
                        </div>
                        <span className="text-lg font-bold">{doctor.availability?.length || 0}</span>
                    </div>
                    {/* Placeholder for future stats */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border opacity-60">
                        <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-orange-500" />
                            <span className="text-sm font-medium">Today's Appts</span>
                        </div>
                        <span className="text-lg font-bold">0</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground shadow-xl">
                 <CardHeader>
                    <CardTitle className="text-lg">Quick Tip</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm opacity-90 leading-relaxed">
                        Keeping your availability up to date helps patients book appointments more efficiently. 
                        Head over to the Availability tab to manage your slots.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;


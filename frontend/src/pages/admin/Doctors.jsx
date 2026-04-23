import React, { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAllDoctors, useApproveDoctor, useRejectDoctor } from "@/hooks/useAdmin";
import { Search, DollarSign, Clock, CheckCircle2, Calendar, AlertCircle, XCircle } from "lucide-react";

const STATUS_OPTIONS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "PENDING":
      return "border-none bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
    case "APPROVED":
      return "border-none bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
    case "REJECTED":
      return "border-none bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300";
    default:
      return "border-none bg-muted text-muted-foreground";
  }
};

const getStatusOutlineClass = (status) => {
  switch (status) {
    case "PENDING":
      return "border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-300";
    case "APPROVED":
      return "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300";
    case "REJECTED":
      return "border-rose-500/20 bg-rose-500/5 text-rose-700 dark:text-rose-300";
    default:
      return "border-border bg-muted/50 text-muted-foreground";
  }
};

const DoctorCard = ({ doctor, onApprove, onReject, isApproving, isRejecting }) => {
  return (
    <Card className="group overflow-hidden border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl">
      <CardHeader className="pb-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <Badge variant="secondary" className={getStatusBadgeClass(doctor.status)}>
            {doctor.status}
          </Badge>
          <div className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
            <CheckCircle2 className="mr-1 h-4 w-4" />
            {doctor.status === "APPROVED" ? "Verified" : doctor.status === "PENDING" ? "Pending review" : "Rejected"}
          </div>
        </div>
        <CardTitle className="text-2xl font-bold transition-colors group-hover:text-primary">
          {doctor.user?.name || "Unknown doctor"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{doctor.user?.email}</p>
      </CardHeader>

      <CardContent className="pb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Specialization
              </span>
              <span className="text-xl font-bold">{doctor.specialization?.replaceAll("_", " ")}</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Consultation Fee
              </span>
              <span className="flex items-center text-xl font-bold">
                <DollarSign className="h-4 w-4" />
                {doctor.fees}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              Submitted On
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={getStatusOutlineClass(doctor.status)}>
                {formatDate(doctor.createdAt) || "Unknown"}
              </Badge>
            </div>
          </div>

          {doctor.documentUrl && (
            <a
              href={doctor.documentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Calendar className="h-4 w-4" />
              View document
            </a>
          )}

          {doctor.rejectionReason && (
            <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                Rejection reason
              </p>
              <p className="mt-1 text-sm text-rose-700 dark:text-rose-300">{doctor.rejectionReason}</p>
            </div>
          )}
        </div>
      </CardContent>

      {doctor.status === "PENDING" && (
        <CardFooter>
          <div className="flex w-full gap-3">
            <Button className="h-11 flex-1 font-semibold transition-all" onClick={() => onApprove(doctor.id)} disabled={isApproving}>
              Approve
            </Button>
            <Button variant="destructive" className="h-11 flex-1 font-semibold transition-all" onClick={() => onReject(doctor)} disabled={isRejecting}>
              Reject
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

const DoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const apiStatus = statusFilter === "ALL" ? null : statusFilter;
  const { data: doctors, isLoading, error } = useGetAllDoctors(apiStatus);
  const { mutate: approveDoctor, isPending: approving } = useApproveDoctor();
  const { mutate: rejectDoctor, isPending: rejecting } = useRejectDoctor();
  const queryClient = useQueryClient();

  const filteredDoctors = useMemo(() => {
    return doctors?.filter((doctor) => {
      const nameMatch = doctor.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const specMatch = doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
      const specializationMatch = specializationFilter === "all" || doctor.specialization === specializationFilter;
      return (!searchTerm || nameMatch || specMatch) && specializationMatch;
    });
  }, [doctors, searchTerm, specializationFilter]);

  const specializations = useMemo(() => {
    const values = doctors?.map((doctor) => doctor.specialization).filter(Boolean) || [];
    return ["all", ...new Set(values)];
  }, [doctors]);

  const handleRejectSubmit = () => {
    if (!selectedDoctor || !rejectReason.trim()) {
      return;
    }

    rejectDoctor(
      { doctorId: selectedDoctor.id, reason: rejectReason },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          setSelectedDoctor(null);
          setRejectReason("");
          queryClient.invalidateQueries({ queryKey: ["all-doctors"] });
        },
      }
    );
  };

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="font-medium text-destructive">Error loading doctors. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-10 space-y-4">
        <h1 className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent lg:text-5xl">
          Doctor Management
        </h1>
        <p className="max-w-2xl text-xl text-muted-foreground">
          Review all doctors, then filter the backend list by status and narrow it down by specialization.
        </p>
      </div>

      <div className="sticky top-20 z-10 mb-8 flex flex-col gap-4 rounded-xl border border-border bg-background/80 p-4 shadow-sm backdrop-blur-md md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or specialization..."
            className="h-11 pl-10"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="w-full md:w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "ALL" ? "All Statuses" : status.charAt(0) + status.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-[200px]">
          <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((specialization) => (
                <SelectItem key={specialization} value={specialization}>
                  {specialization === "all" ? "All Specializations" : specialization.replaceAll("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          Showing {statusFilter === "ALL" ? "all statuses" : statusFilter.toLowerCase()} and {searchTerm ? `search results for \"${searchTerm}\"` : "all doctors"}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("ALL");
            setSpecializationFilter("all");
          }}
        >
          Clear Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors?.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onApprove={approveDoctor}
                onReject={(doctorItem) => {
                  setSelectedDoctor(doctorItem);
                  setShowRejectDialog(true);
                }}
                isApproving={approving}
                isRejecting={rejecting}
              />
            ))
          ) : (
            <div className="col-span-full space-y-4 py-20 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold">No doctors found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter to find what you're looking for.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                  setSpecializationFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Doctor Application</DialogTitle>
            <DialogDescription>
              {selectedDoctor?.user?.name} {selectedDoctor?.specialization ? `- ${selectedDoctor.specialization.replaceAll("_", " ")}` : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="reason">Rejection Reason *</Label>
            <Input
              id="reason"
              placeholder="Enter reason for rejection..."
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectSubmit} disabled={!rejectReason.trim() || rejecting}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorsPage;

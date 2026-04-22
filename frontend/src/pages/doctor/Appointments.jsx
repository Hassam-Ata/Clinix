import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarCheck2, CalendarClock, CheckCircle2, ClipboardList, Loader2, Mail, Search, UserRound, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useCompleteAppointment,
  useDoctorAppointments,
  useDoctorProfile,
  useUpdateAppointmentStatus,
} from "@/hooks/useDoctor";
import { useNavigate } from "react-router-dom";

const STATUS_STYLE = {
  PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  ACCEPTED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  REJECTED: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
  CANCELLED: "bg-muted text-muted-foreground border-border",
  COMPLETED: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
};

const initialDialog = {
  open: false,
  type: null,
  appointment: null,
};

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const { data: profile } = useDoctorProfile();

  React.useEffect(() => {
    if (profile && !profile.specialization) {
      navigate("/doctor/onboard");
    }
  }, [profile, navigate]);

  const { data: appointments = [], isLoading, isError, refetch } = useDoctorAppointments();
  const updateStatusMutation = useUpdateAppointmentStatus();
  const completeMutation = useCompleteAppointment();

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [dialogState, setDialogState] = useState(initialDialog);

  const counts = useMemo(() => {
    return appointments.reduce(
      (acc, appointment) => {
        acc.total += 1;
        if (appointment.status === "PENDING") acc.pending += 1;
        if (appointment.status === "ACCEPTED") acc.accepted += 1;
        if (appointment.status === "COMPLETED") acc.completed += 1;
        return acc;
      },
      { total: 0, pending: 0, accepted: 0, completed: 0 },
    );
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesStatus = statusFilter === "ALL" || appointment.status === statusFilter;

      if (!searchValue) {
        return matchesStatus;
      }

      const patientName = appointment.patient?.name?.toLowerCase() || "";
      const patientEmail = appointment.patient?.email?.toLowerCase() || "";
      return matchesStatus && (patientName.includes(searchValue) || patientEmail.includes(searchValue));
    });
  }, [appointments, statusFilter, search]);

  const openDialog = (type, appointment) => {
    setMeetingLink(appointment?.meetingLink || "");
    setDialogState({ open: true, type, appointment });
  };

  const closeDialog = () => {
    setMeetingLink("");
    setDialogState(initialDialog);
  };

  const isMutating = updateStatusMutation.isPending || completeMutation.isPending;

  const onConfirm = () => {
    const appointmentId = dialogState.appointment?.id;
    if (!appointmentId) {
      return;
    }

    if (dialogState.type === "accept") {
      updateStatusMutation.mutate(
        {
          appointmentId,
          status: "ACCEPTED",
          meetingLink: meetingLink.trim(),
        },
        {
          onSuccess: closeDialog,
        },
      );
      return;
    }

    if (dialogState.type === "reject") {
      updateStatusMutation.mutate(
        {
          appointmentId,
          status: "REJECTED",
        },
        {
          onSuccess: closeDialog,
        },
      );
      return;
    }

    if (dialogState.type === "complete") {
      completeMutation.mutate(appointmentId, {
        onSuccess: closeDialog,
      });
    }
  };

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-semibold">Could not load doctor appointments.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Doctor Appointments</h1>
        <p className="text-muted-foreground">Review requests, accept with meeting links, reject, and complete consultations.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Appointments</CardDescription>
            <CardTitle className="text-3xl">{counts.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4" /> Pending
            </CardDescription>
            <CardTitle className="text-3xl">{counts.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CalendarCheck2 className="h-4 w-4" /> Accepted
            </CardDescription>
            <CardTitle className="text-3xl">{counts.accepted}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Completed
            </CardDescription>
            <CardTitle className="text-3xl">{counts.completed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Appointment List
              </CardTitle>
              <CardDescription>Filter by status and quickly manage each appointment.</CardDescription>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
              <div className="relative w-full sm:w-[260px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-9"
                  placeholder="Search patient"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="ACCEPTED">ACCEPTED</SelectItem>
                  <SelectItem value="REJECTED">REJECTED</SelectItem>
                  <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                  <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="rounded-lg border border-dashed py-16 text-center">
              <p className="text-lg font-semibold">No appointments found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try changing filters or check again later.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Meeting Link</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => {
                    const statusClass = STATUS_STYLE[appointment.status] || "bg-muted text-muted-foreground border-border";
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium flex items-center gap-2">
                              <UserRound className="h-4 w-4 text-muted-foreground" />
                              {appointment.patient?.name || "Patient"}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {appointment.patient?.email || "-"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(appointment.startTime), "EEE, MMM d, yyyy")}</TableCell>
                        <TableCell>
                          {format(new Date(appointment.startTime), "h:mm a")} - {format(new Date(appointment.endTime), "h:mm a")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusClass}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {appointment.meetingLink ? (
                            <a
                              href={appointment.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              Open Link
                            </a>
                          ) : (
                            <span className="text-sm text-muted-foreground">Not set</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end flex-wrap gap-2">
                            {appointment.status === "PENDING" && (
                              <>
                                <Button size="sm" onClick={() => openDialog("accept", appointment)}>
                                  Accept
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => openDialog("reject", appointment)}>
                                  Reject
                                </Button>
                              </>
                            )}

                            {appointment.status === "ACCEPTED" && (
                              <Button size="sm" variant="outline" onClick={() => openDialog("complete", appointment)}>
                                Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogState.open} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent>
          {dialogState.type === "accept" && (
            <>
              <DialogHeader>
                <DialogTitle>Accept appointment</DialogTitle>
                <DialogDescription>
                  Optionally add a meeting link now. You can proceed without it and update later by accepting again.
                </DialogDescription>
              </DialogHeader>
              <Input
                value={meetingLink}
                onChange={(event) => setMeetingLink(event.target.value)}
                placeholder="https://meet.google.com/..."
              />
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button onClick={onConfirm} disabled={isMutating}>
                  {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Accept"}
                </Button>
              </DialogFooter>
            </>
          )}

          {dialogState.type === "reject" && (
            <>
              <DialogHeader>
                <DialogTitle>Reject appointment</DialogTitle>
                <DialogDescription>
                  This will mark the appointment as rejected and notify the patient.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Keep Pending
                </Button>
                <Button variant="destructive" onClick={onConfirm} disabled={isMutating}>
                  {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  Reject
                </Button>
              </DialogFooter>
            </>
          )}

          {dialogState.type === "complete" && (
            <>
              <DialogHeader>
                <DialogTitle>Complete appointment</DialogTitle>
                <DialogDescription>
                  Only accepted appointments can be completed. This action updates patient history and billing flow.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Not Yet
                </Button>
                <Button onClick={onConfirm} disabled={isMutating}>
                  {isMutating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark Complete"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorAppointments;

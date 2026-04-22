import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarDays, ExternalLink, Stethoscope, UserRound, XCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/api/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_STYLE = {
  PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  ACCEPTED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  REJECTED: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
  CANCELLED: "bg-muted text-muted-foreground border-border",
  COMPLETED: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
};

const Appointments = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cancelCandidate, setCancelCandidate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data: appointments = [], isLoading, isError } = useQuery({
    queryKey: ["patient-appointments"],
    queryFn: async () => {
      const response = await api.get("/appointment/my");
      return response.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (appointmentId) => {
      const response = await api.patch(`/appointment/${appointmentId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Appointment cancelled successfully.");
      setCancelCandidate(null);
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Unable to cancel appointment.";
      toast.error(message);
    },
  });

  const filteredAppointments = useMemo(() => {
    const sortedAppointments = [...appointments].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    );

    if (statusFilter === "ALL") {
      return sortedAppointments;
    }

    return sortedAppointments.filter((appointment) => appointment.status === statusFilter);
  }, [appointments, statusFilter]);

  const canCancel = (appointment) => {
    if (!appointment) {
      return false;
    }

    return appointment.status === "PENDING";
  };

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg font-semibold">Could not load your appointments.</p>
        <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["patient-appointments"] })}>
          Retry
        </Button>
      </div>
    );
  }

  const AppointmentCard = ({ appointment }) => {
    const statusClass = STATUS_STYLE[appointment.status] || "bg-muted text-muted-foreground border-border";

    return (
      <Card className="border-border/80">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant="outline" className={statusClass}>
              {appointment.status}
            </Badge>
            <p className="text-xs text-muted-foreground">Booked on {format(new Date(appointment.createdAt), "MMM d, yyyy")}</p>
          </div>
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserRound className="h-5 w-5 text-primary" />
              {appointment.doctor?.user?.name || "Doctor"}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <Stethoscope className="h-4 w-4" />
              {(appointment.doctor?.specialization || "GENERAL").replaceAll("_", " ")}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <p className="mb-1 text-xs font-medium text-muted-foreground">Date</p>
            <p className="text-sm font-semibold">{format(new Date(appointment.startTime), "EEEE, MMM d, yyyy")}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="mb-1 text-xs font-medium text-muted-foreground">Time</p>
            <p className="text-sm font-semibold">
              {format(new Date(appointment.startTime), "h:mm a")} - {format(new Date(appointment.endTime), "h:mm a")}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2">
          {appointment.status === "ACCEPTED" && appointment.meetingLink && (
            <Button onClick={() => window.open(appointment.meetingLink, "_blank", "noopener,noreferrer")}>
              Join Meeting
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}

          {canCancel(appointment) && (
            <Button variant="outline" onClick={() => setCancelCandidate(appointment)}>
              Cancel Appointment
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Appointments</h1>
          <p className="mt-1 text-muted-foreground">Track all your appointments and filter them by status.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[220px]">
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
          <Button onClick={() => navigate("/patient/doctors")}>Book New Appointment</Button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-44 w-full" />
          </div>
        ) : filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
              <CalendarDays className="h-10 w-10 text-muted-foreground" />
              <div>
                <p className="text-lg font-semibold">No appointments found</p>
                <p className="text-sm text-muted-foreground">
                  {statusFilter === "ALL"
                    ? "Choose a doctor and book your first consultation."
                    : `No appointments with status ${statusFilter}.`}
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate("/patient/doctors")}>Browse Doctors</Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={!!cancelCandidate} onOpenChange={(open) => !open && setCancelCandidate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this appointment?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Your doctor will be notified after cancellation.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelCandidate(null)}>
              Keep Appointment
            </Button>
            <Button
              variant="destructive"
              disabled={cancelMutation.isPending}
              onClick={() => cancelCandidate && cancelMutation.mutate(cancelCandidate.id)}
            >
              {cancelMutation.isPending ? "Cancelling..." : "Confirm Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
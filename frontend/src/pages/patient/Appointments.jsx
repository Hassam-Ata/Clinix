import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Clock, 
  Video, 
  User, 
  MoreHorizontal, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  CalendarDays
} from "lucide-react";
import { format, isPast, isFuture } from "date-fns";

const Appointments = () => {
  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: async () => {
      const response = await api.get("/appointment/my");
      return response.data;
    },
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "ACCEPTED": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200";
      case "PENDING": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200";
      case "CANCELLED": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200";
      case "COMPLETED": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ACCEPTED": return <CheckCircle2 className="h-4 w-4 mr-1.5" />;
      case "PENDING": return <Clock className="h-4 w-4 mr-1.5" />;
      case "CANCELLED": return <XCircle className="h-4 w-4 mr-1.5" />;
      case "COMPLETED": return <CheckCircle2 className="h-4 w-4 mr-1.5" />;
      default: return <AlertCircle className="h-4 w-4 mr-1.5" />;
    }
  };

  const upcomingAppointments = appointments?.filter(app => isFuture(new Date(app.startTime)) && app.status !== "CANCELLED") || [];
  const pastAppointments = appointments?.filter(app => isPast(new Date(app.startTime)) || app.status === "COMPLETED" || app.status === "CANCELLED") || [];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-xl font-medium">Failed to load appointments</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const AppointmentCard = ({ appointment }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border overflow-hidden bg-card/50 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row">
        <div className={`w-2 shrink-0 ${getStatusColor(appointment.status).split(" ")[0].replace("bg-", "bg-opacity-100 bg-")}`} />
        <div className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <Badge variant="outline" className={`${getStatusColor(appointment.status)} border px-2 py-0.5 font-medium flex items-center w-fit`}>
                {getStatusIcon(appointment.status)}
                {appointment.status}
              </Badge>
              <CardTitle className="text-xl font-bold mt-2 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {appointment.doctor.user.name}
              </CardTitle>
              <CardDescription className="font-medium text-primary/80">
                {appointment.doctor.specialization.replace("_", " ")}
              </CardDescription>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Appointment ID</p>
              <p className="text-xs font-mono text-muted-foreground/60">#{appointment.id.split("-")[0]}</p>
            </div>
          </CardHeader>
          <CardContent className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">DATE</p>
                  <p className="text-sm font-bold">{format(new Date(appointment.startTime), "EEEE, MMM do, yyyy")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">TIME</p>
                  <p className="text-sm font-bold">
                    {format(new Date(appointment.startTime), "h:mm a")} - {format(new Date(appointment.endTime), "h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-0 pb-6">
            {appointment.status === "ACCEPTED" && appointment.meetingLink && (
              <Button className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20" onClick={() => window.open(appointment.meetingLink, "_blank")}>
                <Video className="h-4 w-4" />
                Join Consultation
              </Button>
            )}
            <Button variant="outline" className="w-full sm:w-auto gap-2" onClick={() => console.log("View details", appointment.id)}>
              View Details
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            My Appointments
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your consultations and track your health journey.
          </p>
        </div>
        <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20" onClick={() => window.location.href = "/patient/doctors"}>
          Book New Consultation
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full space-y-8">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] h-12 p-1 bg-muted/50 backdrop-blur-sm border border-border">
          <TabsTrigger value="upcoming" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm font-semibold">
            Upcoming
            {upcomingAppointments.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-primary text-primary-foreground rounded-full">
                {upcomingAppointments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm font-semibold">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-2xl" />
              ))}
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {upcomingAppointments.map((app) => (
                <AppointmentCard key={app.id} appointment={app} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 py-16 text-center space-y-6 bg-transparent">
              <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                <CalendarDays className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">No upcoming appointments</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  You don't have any consultations scheduled at the moment. Take the first step towards better health today.
                </p>
              </div>
              <Button onClick={() => window.location.href = "/patient/doctors"} variant="outline" className="rounded-full">
                Browse Specialists
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-2xl" />
              ))}
            </div>
          ) : pastAppointments.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {pastAppointments.map((app) => (
                <AppointmentCard key={app.id} appointment={app} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-muted-foreground italic">
              No appointment history found.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;

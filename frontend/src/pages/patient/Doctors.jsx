import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, DollarSign, Clock, CheckCircle2, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const formatInUTC = (dateString, formatStr) => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    ...(formatStr === "MMM do"
      ? { month: "short", day: "numeric" }
      : { hour: "2-digit", minute: "2-digit", hour12: false }),
  }).format(date);
};

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await api.get("/doctor/all");
      return response.data;
    },
  });

  const filteredDoctors = doctors?.filter((doctor) => {
    const nameMatch = doctor.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const specMatch = doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || specMatch;
    const matchesSpecialization = specializationFilter === "all" || doctor.specialization === specializationFilter;
    return matchesSearch && matchesSpecialization;
  });

  const specializations = doctors ? ["all", ...new Set(doctors.map((doctor) => doctor.specialization))] : ["all"];

  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-medium text-destructive">Error loading doctors. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-10 space-y-4">
        <h1 className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent lg:text-5xl">
          Find Your Specialist
        </h1>
        <p className="max-w-2xl text-xl text-muted-foreground">
          Browse through our network of certified medical professionals and book your consultation in seconds.
        </p>
      </div>

      <div className="sticky top-20 z-10 mb-8 flex flex-col gap-4 rounded-xl border border-border bg-background/80 p-4 shadow-sm backdrop-blur-md md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or specialization..."
            className="h-11 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-[200px]">
          <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Specialization" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec === "all" ? "All Specialists" : spec.charAt(0) + spec.slice(1).toLowerCase().replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
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
              <Card key={doctor.id} className="group overflow-hidden border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl">
                <CardHeader className="pb-4">
                  <div className="mb-2 flex items-start justify-between">
                    <Badge variant="secondary" className="border-none bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {doctor.specialization.replace("_", " ")}
                    </Badge>
                    <div className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Verified
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold transition-colors group-hover:text-primary">
                    {doctor.user.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="space-y-4">
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
                        Available Slots
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {doctor.availability?.length > 0 ? (
                          doctor.availability.map((slot) => (
                            <Badge key={slot.id} variant="outline" className="border-primary/20 bg-primary/5 py-1 text-xs font-normal">
                              {formatInUTC(slot.startTime, "MMM do")}: {formatInUTC(slot.startTime, "HH:mm")} to {formatInUTC(slot.endTime, "HH:mm")}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs italic text-muted-foreground">No slots scheduled</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="h-11 w-full font-semibold transition-all" onClick={() => handleBookClick(doctor)}>
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>
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
                  setSpecializationFilter("all");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      <BookingDialog doctor={selectedDoctor} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
};

const BookingDialog = ({ doctor, isOpen, onClose }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const queryClient = useQueryClient();

  const { data: availability, isLoading } = useQuery({
    queryKey: ["availability", doctor?.id],
    queryFn: async () => {
      const response = await api.get(`/doctor/availability/${doctor.id}`);
      return response.data;
    },
    enabled: !!doctor?.id && isOpen,
  });

  useEffect(() => {
    if (!isOpen) {
      setSelectedSlot(null);
    }
  }, [isOpen, doctor?.id]);

  const formatSlot = (slot) => {
    if (!slot) {
      return "";
    }

    return `${formatInUTC(slot.startTime, "MMM do")} ${formatInUTC(slot.startTime, "HH:mm")} to ${formatInUTC(slot.endTime, "HH:mm")}`;
  };

  const bookAppointmentMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post("/appointment", payload);
      return response.data;
    },
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["availability", doctor?.id] });
      toast.success(`Appointment booked successfully. Status: ${appointment.status}.`);
      setSelectedSlot(null);
      onClose();
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to book appointment.";
      toast.error(message);
    },
  });

  const handleBooking = () => {
    if (!selectedSlot || !doctor?.id) {
      return;
    }

    bookAppointmentMutation.mutate({
      doctorId: doctor.id,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedSlot(null);
          onClose();
        }
      }}
    >
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[560px]">
        <div className="border-b bg-muted/30 p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-semibold">
              <Calendar className="h-6 w-6" />
              Book Appointment
            </DialogTitle>
            <DialogDescription className="text-base">With {doctor?.user.name}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="capitalize">
              {doctor?.specialization.toLowerCase().replace("_", " ")}
            </Badge>
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              {doctor?.fees} Consultation Fee
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Select Available Slot</h3>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ) : availability?.length > 0 ? (
              <div className="grid max-h-[300px] grid-cols-1 gap-3 overflow-y-auto pr-2 custom-scrollbar sm:grid-cols-2">
                {availability.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                      selectedSlot?.id === slot.id
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-border hover:border-primary/30 hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-sm font-semibold">{formatSlot(slot)}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed bg-muted/30 py-8 text-center">
                <p className="font-medium italic text-muted-foreground">No slots available right now.</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Selected slot</p>
                <p className="text-sm text-muted-foreground">{selectedSlot ? formatSlot(selectedSlot) : "Pick one slot to continue."}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t bg-muted/20 p-6 sm:justify-between">
          <Button
            variant="ghost"
            className="font-semibold text-muted-foreground"
            onClick={() => {
              setSelectedSlot(null);
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            className="w-full min-w-[160px] font-semibold sm:w-auto"
            disabled={!selectedSlot || bookAppointmentMutation.isPending}
            onClick={handleBooking}
          >
            {bookAppointmentMutation.isPending ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Doctors;
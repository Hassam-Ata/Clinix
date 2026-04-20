import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Stethoscope, DollarSign, Clock, CheckCircle2, Calendar, MapPin, Star, AlertCircle } from "lucide-react";
import { format } from "date-fns";

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

  const formatInUTC = (dateString, formatStr) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "UTC",
      ...(formatStr === "MMM do" ? { month: "short", day: "numeric" } : { hour: "2-digit", minute: "2-digit", hour12: false })
    }).format(date);
  };

  const filteredDoctors = doctors?.filter((doctor) => {
    const nameMatch = doctor.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const specMatch = doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || specMatch;
    const matchesSpecialization = specializationFilter === "all" || doctor.specialization === specializationFilter;
    return matchesSearch && matchesSpecialization;
  });

  const specializations = doctors ? ["all", ...new Set(doctors.map(d => d.specialization))] : ["all"];

  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive font-medium">Error loading doctors. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-10 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Find Your Specialist
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Browse through our network of certified medical professionals and book your consultation in seconds.
        </p>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-20 z-10 bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or specialization..."
            className="pl-10 h-11"
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

      {/* Doctors Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors?.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="group hover:shadow-2xl transition-all duration-300 border-border hover:border-primary/50 overflow-hidden bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-none">
                      {doctor.specialization.replace("_", " ")}
                    </Badge>
                    <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verified
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {doctor.user.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm">
                    <Stethoscope className="h-3 w-3" />
                    Specialist Physician
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Consultation Fee</span>
                        <span className="text-xl font-bold flex items-center">
                          <DollarSign className="h-4 w-4" />
                          {doctor.fees}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-bold text-foreground">4.9</span>
                        <span className="text-xs text-muted-foreground">(120)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Available Slots
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {doctor.availability?.length > 0 ? (
                          doctor.availability.map((slot) => (
                            <Badge key={slot.id} variant="outline" className="font-normal text-xs py-1 border-primary/20 bg-primary/5">
                              {formatInUTC(slot.startTime, "MMM do")}: {formatInUTC(slot.startTime, "HH:mm")} to {formatInUTC(slot.endTime, "HH:mm")}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No slots scheduled</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold" 
                    onClick={() => handleBookClick(doctor)}>
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold">No doctors found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter to find what you're looking for.</p>
              <Button variant="outline" onClick={() => { setSearchTerm(""); setSpecializationFilter("all"); }}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Booking Dialog */}
      <BookingDialog 
        doctor={selectedDoctor} 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
};

const BookingDialog = ({ doctor, isOpen, onClose }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { data: availability, isLoading } = useQuery({
    queryKey: ["availability", doctor?.id],
    queryFn: async () => {
      const response = await api.get(`/doctor/availability/${doctor.id}`);
      return response.data;
    },
    enabled: !!doctor?.id && isOpen,
  });

  const handleBooking = async () => {
    if (!selectedSlot) return;
    try {
      await api.post("/appointment", {
        doctorId: doctor.id,
        availabilityId: selectedSlot.id,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });
      alert("Appointment booked successfully!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to book appointment");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-br from-primary to-blue-700 p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Book Appointment
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-base">
              With {doctor?.user.name}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
              <Badge variant="outline" className="border-white/50 text-white capitalize">
                {doctor?.specialization.toLowerCase().replace("_", " ")}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
               <DollarSign className="h-4 w-4" />
               {doctor?.fees} Consultation Fee
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Available Slot</h3>
            
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ) : availability?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {availability.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className={`flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left ${
                      selectedSlot?.id === slot.id
                        ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                        : "border-border hover:border-primary/30 hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-sm font-semibold">
                      {formatInUTC(slot.startTime, "MMM do")}: {formatInUTC(slot.startTime, "HH:mm")} to {formatInUTC(slot.endTime, "HH:mm")}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/30 rounded-2xl border-2 border-dashed">
                <p className="text-muted-foreground font-medium italic">No slots available this week.</p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              Appointment link will be shared after doctor approval. Cancellation is free up to 24 hours before the session.
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 bg-muted/30 border-t items-center sm:justify-between gap-4">
          <Button variant="ghost" className="font-semibold text-muted-foreground" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="w-full sm:w-auto min-w-[150px] font-bold shadow-xl shadow-primary/20" 
            disabled={!selectedSlot}
            onClick={handleBooking}
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Doctors;

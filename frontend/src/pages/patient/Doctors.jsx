import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Stethoscope, DollarSign, Clock, CheckCircle2 } from "lucide-react";

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");

  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await api.get("/doctor/all");
      return response.data;
    },
  });

  const filteredDoctors = doctors?.filter((doctor) => {
    const matchesSearch = doctor.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = specializationFilter === "all" || doctor.specialization === specializationFilter;
    return matchesSearch && matchesSpecialization;
  });

  const specializations = doctors ? ["all", ...new Set(doctors.map(d => d.specialization))] : ["all"];

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
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-20 z-10 bg-background/80 backdrop-blur-md p-4 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or specialization..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div >
          <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
            <SelectTrigger>
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
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Experience</span>
                        <span className="text-sm font-medium">5+ Years</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Next Availability
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {doctor.availability?.length > 0 ? (
                          doctor.availability.slice(0, 2).map((slot) => (
                            <Badge key={slot.id} variant="outline" className="font-normal text-xs py-1">
                              {slot.day}: {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No slots scheduled this week</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full h-11 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold" 
                    onClick={() => console.log(`Booking for ${doctor.id}`)}>
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
    </div>
  );
};

export default Doctors;

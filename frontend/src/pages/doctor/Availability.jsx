import React from "react";
import { useDoctorAvailability, useAddAvailability, useDeleteAvailability } from "@/hooks/useDoctor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, Plus, Calendar, Clock, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

const Availability = () => {
  const { data: slots, isLoading } = useDoctorAvailability();
  const addMutation = useAddAvailability();
  const deleteMutation = useDeleteAvailability();

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      day: "MONDAY",
      startTime: "",
      endTime: "",
    }
  });

  const onSubmit = (data) => {
    // We need to format the time into ISO string as the API expects
    // The API examples show: "2026-04-21T09:00:00.000Z"
    // Since we only have time and day, we'll use a dummy date for the year/month/day
    // but the backend might expect specific formatting. 
    // Looking at the user's request: "2026-04-21T09:00:00.000Z"
    
    // For simplicity, we'll combine a base date with the selected time
    const baseDate = "2026-04-20"; // Just a reference date
    const startTimeISO = new Date(`${baseDate}T${data.startTime}:00Z`).toISOString();
    const endTimeISO = new Date(`${baseDate}T${data.endTime}:00Z`).toISOString();

    addMutation.mutate({
      day: data.day,
      startTime: startTimeISO,
      endTime: endTimeISO,
    }, {
      onSuccess: () => reset()
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this slot?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Manage Availability</h1>
          <p className="text-muted-foreground text-lg">Define your weekly consultation hours</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Slot Form */}
        <Card className="h-fit shadow-xl border-primary/10">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add New Slot
            </CardTitle>
            <CardDescription>Select a day and time range for your consultations.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="day">Day of the Week</Label>
                <Select onValueChange={(val) => setValue("day", val)} defaultValue="MONDAY">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input 
                    id="startTime" 
                    type="time" 
                    {...register("startTime", { required: true })}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input 
                    id="endTime" 
                    type="time" 
                    {...register("endTime", { required: true })}
                    className="w-full"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full gap-2" 
                disabled={addMutation.isPending}
              >
                {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Save Available Slot
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Slots List */}
        <Card className="lg:col-span-2 shadow-xl border-none">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Current Schedule
            </CardTitle>
            <CardDescription>Your patients will be able to book appointments during these times.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : slots?.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                <p className="text-muted-foreground font-medium">No availability slots added yet.</p>
                <p className="text-sm text-muted-foreground/60">Use the form on the left to add your first slot.</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold">Day</TableHead>
                    <TableHead className="font-semibold">Time Range</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slots?.map((slot) => (
                    <TableRow key={slot.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                            {slot.day}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(slot.startTime), "p")}</span>
                          <span className="text-muted-foreground">→</span>
                          <span>{format(new Date(slot.endTime), "p")}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(slot.id)}
                          className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Availability;

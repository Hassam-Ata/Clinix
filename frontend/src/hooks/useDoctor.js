import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";

export const useDoctorProfile = () => {
  return useQuery({
    queryKey: ["doctor-profile"],
    queryFn: async () => {
      const response = await api.get("/doctor/me");
      return response.data;
    },
  });
};

export const useDoctorAvailability = () => {
  return useQuery({
    queryKey: ["doctor-availability"],
    queryFn: async () => {
      const response = await api.get("/doctor/availability/me");
      return response.data;
    },
  });
};

export const useAddAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/doctor/availability", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-availability"] });
      toast.success("Availability slot added successfully!");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to add availability.";
      toast.error(message);
    },
  });
};

export const useDeleteAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/doctor/availability/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-availability"] });
      toast.success("Availability slot removed.");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to delete slot.";
      toast.error(message);
    },
  });
};

export const useOnboardDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/doctor/onboard", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-profile"] });
      toast.success("Onboarding profile submitted successfully!");
    },
    onError: (error) => {
      if (error.response?.status === 403) {
        toast.info("You have already onboarded.");
      } else {
        const message = error.response?.data?.message || "Failed to submit onboarding profile.";
        toast.error(message);
      }
    },
  });
};

export const useDoctorAppointments = () => {
  return useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: async () => {
      const response = await api.get("/appointment/doctor");
      return response.data;
    },
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appointmentId, status, meetingLink }) => {
      const response = await api.patch(`/appointment/${appointmentId}/status`, {
        status,
        ...(meetingLink ? { meetingLink } : {}),
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      if (variables.status === "ACCEPTED") {
        toast.success("Appointment accepted.");
      } else {
        toast.success("Appointment rejected.");
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to update appointment status.";
      toast.error(message);
    },
  });
};

export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId) => {
      const response = await api.patch(`/appointment/${appointmentId}/complete`, {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      toast.success("Appointment marked as completed.");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to complete appointment.";
      toast.error(message);
    },
  });
};


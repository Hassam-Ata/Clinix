import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { toast } from "sonner";

// Dashboard Overview Data
export const useAdminOverview = () => {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard/overview");
      return response.data;
    },
  });
};

// Dashboard Doctors Data
export const useAdminDoctors = () => {
  return useQuery({
    queryKey: ["admin-doctors-dashboard"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard/doctors");
      return response.data;
    },
  });
};

// Dashboard Appointments Data
export const useAdminAppointments = () => {
  return useQuery({
    queryKey: ["admin-appointments-dashboard"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard/appointments");
      return response.data;
    },
  });
};

// Dashboard Payments Data
export const useAdminPayments = () => {
  return useQuery({
    queryKey: ["admin-payments-dashboard"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard/payments");
      return response.data;
    },
  });
};

// Dashboard Revenue Data
export const useAdminRevenue = () => {
  return useQuery({
    queryKey: ["admin-revenue"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard/revenue");
      return response.data;
    },
  });
};

// Get all doctors (with optional status filter)
export const useGetAllDoctors = (status = null) => {
  return useQuery({
    queryKey: ["all-doctors", status],
    queryFn: async () => {
      const params = status ? `?status=${status}` : "";
      const response = await api.get(`/admin/doctors${params}`);
      return response.data;
    },
  });
};

// Get single doctor
export const useGetSingleDoctor = (doctorId) => {
  return useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: async () => {
      const response = await api.get(`/admin/doctors/${doctorId}`);
      return response.data;
    },
    enabled: !!doctorId,
  });
};

// Approve Doctor
export const useApproveDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (doctorId) => {
      const response = await api.patch(`/admin/doctors/${doctorId}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-doctors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-doctors-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success("Doctor approved successfully!");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to approve doctor.";
      toast.error(message);
    },
  });
};

// Reject Doctor
export const useRejectDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ doctorId, reason }) => {
      const response = await api.patch(`/admin/doctors/${doctorId}/reject`, { reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-doctors"] });
      queryClient.invalidateQueries({ queryKey: ["admin-doctors-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      toast.success("Doctor rejected successfully!");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to reject doctor.";
      toast.error(message);
    },
  });
};

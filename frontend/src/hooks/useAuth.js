import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/api/axios";

const getDashboardPath = (role) => {
  if (role === "DOCTOR") {
    return "/doctor/dashboard";
  }

  if (role === "PATIENT") {
    return "/patient/dashboard";
  }

  if (role === "ADMIN") {
    return "/admin/dashboard";
  }

  return "/";
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data) => {
      // data includes name, email, password, role
      const response = await api.post("/auth/register", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem("access_token", data.access_token);
      
      toast.success("Login successful!");
      
      // Redirect based on role
      navigate(getDashboardPath(data.role));
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(message);
    },
  });
};

export const useValidateToken = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (token) => {
      const response = await api.post("/auth/validate", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    },
    onSuccess: (data) => {
      navigate(getDashboardPath(data.role));
    },
    onError: () => {
      // If token is invalid, clear it
      localStorage.removeItem("access_token");
    }
  });
};

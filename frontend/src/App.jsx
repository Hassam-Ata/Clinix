import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import RootLayout from "./components/layout/RootLayout";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import DoctorDashboard from "./pages/doctor/Dashboard";
import Availability from "./pages/doctor/Availability";
import PatientDashboard from "./pages/patient/Dashboard";
import PatientDoctors from "./pages/patient/Doctors";
import PatientAppointments from "./pages/patient/Appointments";
import AdminDashboard from "./pages/admin/Dashboard";
import { useValidateToken } from "./hooks/useAuth";

const AuthBootstrap = () => {
  const { mutate: validateToken } = useValidateToken();
  const location = useLocation();
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const isPublicAuthRoute = ["/", "/login", "/register"].includes(location.pathname);

    if (token && (!hasBootstrapped.current || isPublicAuthRoute)) {
      hasBootstrapped.current = true;
      validateToken(token);
    }
  }, [location.pathname, validateToken]);

  return null;
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <AuthBootstrap />
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/availability" element={<Availability />} />
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/doctors" element={<PatientDoctors />} />
            <Route path="/patient/appointments" element={<PatientAppointments />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;


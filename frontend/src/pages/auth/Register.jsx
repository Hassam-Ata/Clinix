import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Activity, User, Stethoscope, Lock, Mail } from "lucide-react";
import { registerSchema } from "@/schemas/authSchema";
import { useRegister } from "@/hooks/useAuth";

const Register = () => {
  const [role, setRole] = useState("PATIENT");
  const { mutate, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    const { name, email, password } = data;
    mutate({ name, email, password, role });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border shadow-xl animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 text-primary">
            <Activity className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
          <p className="text-muted-foreground mt-2">Join Clinix to experience modern healthcare</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("name")}
                placeholder="Full Name"
                className={`pl-10 h-11 ${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("email")}
                placeholder="Email Address"
                type="email"
                className={`pl-10 h-11 ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("password")}
                placeholder="Password"
                type="password"
                className={`pl-10 h-11 ${errors.password ? "border-destructive" : ""}`}
              />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("confirmPassword")}
                placeholder="Confirm Password"
                type="password"
                className={`pl-10 h-11 ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Select your role</label>
            <Accordion type="single" collapsible className="w-full border rounded-lg bg-muted/30 overflow-hidden">
              <AccordionItem value="role-selection" className="border-none">
                <AccordionTrigger className="px-4 hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    {role === "PATIENT" ? <User className="h-4 w-4" /> : <Stethoscope className="h-4 w-4" />}
                    <span>Registering as <span className="font-bold text-primary">{role}</span></span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0 px-1">
                  <div className="flex flex-col gap-1 p-2">
                    <button
                      type="button"
                      onClick={() => setRole("PATIENT")}
                      className={`flex items-center gap-3 w-full px-3 py-3 rounded-md transition-colors ${
                        role === "PATIENT" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <User className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">Patient</div>
                        <div className="text-xs opacity-80">I want to book appointments</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("DOCTOR")}
                      className={`flex items-center gap-3 w-full px-3 py-3 rounded-md transition-colors ${
                        role === "DOCTOR" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`}
                    >
                      <Stethoscope className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">Doctor</div>
                        <div className="text-xs opacity-80">I want to manage patients</div>
                      </div>
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Button 
            type="submit" 
            className="w-full h-11"
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, Lock, Mail } from "lucide-react";
import { loginSchema } from "@/schemas/authSchema";
import { useLogin, useValidateToken } from "@/hooks/useAuth";

const Login = () => {
  const { mutate: login, isPending } = useLogin();
  const { mutate: validateToken } = useValidateToken();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      validateToken(token);
    }
  }, [validateToken]);

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border shadow-xl animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 text-primary">
            <Activity className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground mt-2">Login to your Clinix account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
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
          </div>

     
          <Button 
            type="submit" 
            className="w-full h-11"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

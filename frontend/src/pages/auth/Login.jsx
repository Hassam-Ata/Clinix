import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, Lock, Mail, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background elements - using theme-aware colors */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md space-y-8 bg-card/80 backdrop-blur-md p-8 rounded-[2rem] border border-border shadow-2xl transition-all">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-primary/20 mb-8 transform transition-all hover:scale-105 active:scale-95 group">
            <Activity className="h-9 w-9 text-primary-foreground group-hover:animate-pulse" />
          </Link>
          <h2 className="text-4xl font-black tracking-tight text-foreground mb-2">Welcome Back</h2>
          <p className="text-muted-foreground font-medium text-lg text-balance">Secure access to Clinix</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-5">
            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                {...register("email")}
                placeholder="Email Address"
                type="email"
                className={`pl-12 h-14 bg-muted/30 border-transparent focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl transition-all font-medium text-foreground ${
                  errors.email ? "border-destructive/50 focus:ring-destructive/10 bg-destructive/5" : ""
                }`}
              />
              {errors.email && (
                <div className="flex items-center gap-1.5 mt-2 ml-1 text-destructive animate-in slide-in-from-top-2">
                   <span className="text-xs font-bold uppercase tracking-wider">{errors.email.message}</span>
                </div>
              )}
            </div>

            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                {...register("password")}
                placeholder="Password"
                type="password"
                className={`pl-12 h-14 bg-muted/30 border-transparent focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl transition-all font-medium text-foreground ${
                  errors.password ? "border-destructive/50 focus:ring-destructive/10 bg-destructive/5" : ""
                }`}
              />
              {errors.password && (
                <div className="flex items-center gap-1.5 mt-2 ml-1 text-destructive animate-in slide-in-from-top-2">
                   <span className="text-xs font-bold uppercase tracking-wider">{errors.password.message}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link to="/forgot-password" size="sm" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors decoration-2 underline-offset-4 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-extrabold shadow-xl shadow-primary/25 transition-all active:scale-[0.98] rounded-xl"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-[3px] border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                <span className="tracking-wide text-primary-foreground">Identifying...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="tracking-wide">Access Dashboard</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-card px-6 text-muted-foreground font-bold tracking-[0.2em]">Partner with Clinix</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            asChild
            className="w-full h-14 border-2 border-border hover:bg-muted text-foreground font-bold rounded-xl transition-all"
          >
            <Link to="/register">Create an account</Link>
          </Button>
        </form>
      </div>

      <footer className="mt-12 text-muted-foreground text-sm font-bold tracking-tight">
        &copy; {new Date().getFullYear()} CLINIX HEALTHCARE • v1.0.4
      </footer>
    </div>
  );
};

export default Login;

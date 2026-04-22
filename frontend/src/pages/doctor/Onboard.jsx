import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Activity, FileText, DollarSign, Stethoscope, ArrowRight, Loader2 } from "lucide-react";
import { doctorOnboardSchema } from "@/schemas/doctorSchema";
import { useOnboardDoctor, useDoctorProfile } from "@/hooks/useDoctor";

const specializations = [
  "CARDIOLOGIST",
  "DERMATOLOGIST",
  "NEUROLOGIST",
  "PEDIATRICIAN",
  "PSYCHIATRIST",
  "GENERAL_PHYSICIAN",
  "ORTHOPEDIC",
  "GYNECOLOGIST",
  "OPHTHALMOLOGIST",
];

const Onboard = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: isProfileLoading } = useDoctorProfile();
  const { mutate: onboard, isPending } = useOnboardDoctor();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(doctorOnboardSchema),
    defaultValues: {
      specialization: "",
      fees: 50,
      documentUrl: "",
    },
  });

  // If already onboarded, redirect to dashboard
  useEffect(() => {
    if (profile && profile.specialization) {
      navigate("/doctor/dashboard");
    }
  }, [profile, navigate]);

  const onSubmit = (data) => {
    onboard(data, {
      onSuccess: () => {
        navigate("/doctor/dashboard");
      },
    });
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 text-primary">
          <Stethoscope className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Complete Your Profile</h1>
        <p className="text-muted-foreground text-lg">
          Please provide your professional details to start practicing on Clinix.
        </p>
      </div>

      <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Professional Information</CardTitle>
          <CardDescription>
            These details will be reviewed by our admin team for verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              {/* Specialization */}
              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-sm font-semibold">Specialization</Label>
                <div className="relative">
                  <Select onValueChange={(value) => setValue("specialization", value)}>
                    <SelectTrigger className="h-12 bg-background border-muted-foreground/20">
                      <SelectValue placeholder="Select your specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.specialization && (
                  <p className="text-xs text-destructive">{errors.specialization.message}</p>
                )}
              </div>

              {/* Consultation Fees */}
              <div className="space-y-2">
                <Label htmlFor="fees" className="text-sm font-semibold">Consultation Fees ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="fees"
                    type="number"
                    {...register("fees")}
                    className="pl-10 h-12 bg-background border-muted-foreground/20"
                    placeholder="e.g. 50"
                  />
                </div>
                {errors.fees && (
                  <p className="text-xs text-destructive">{errors.fees.message}</p>
                )}
              </div>

              {/* Document URL */}
              <div className="space-y-2">
                <Label htmlFor="documentUrl" className="text-sm font-semibold">Medical License / Verification Document (URL)</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="documentUrl"
                    {...register("documentUrl")}
                    className="pl-10 h-12 bg-background border-muted-foreground/20"
                    placeholder="https://example.com/license.pdf"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic">
                  Upload your license to a cloud storage (Gdrive, Dropbox) and provide the public link.
                </p>
                {errors.documentUrl && (
                  <p className="text-xs text-destructive">{errors.documentUrl.message}</p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-bold group"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit for Verification
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Activity className="h-4 w-4 text-primary" />
        <span>Secure & Professional Platform</span>
      </div>
    </div>
  );
};

export default Onboard;

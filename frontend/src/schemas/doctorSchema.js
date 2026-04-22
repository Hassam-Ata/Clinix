import * as z from "zod";

export const doctorOnboardSchema = z.object({
  specialization: z.string().min(2, "Specialization is required"),
  fees: z.coerce.number().min(0, "Fees must be a positive number"),
  documentUrl: z.string().url("Please provide a valid URL for your document"),
});

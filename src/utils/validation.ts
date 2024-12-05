import { z } from 'zod';

export type RegistrationForm = z.infer<typeof registrationSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional()
});

export const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  planId: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const consultantProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name is required'),
  expertise: z.array(z.string()).min(1, 'Select at least one area of expertise'),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive'),
  experience: z.string().min(50, 'Experience description must be at least 50 characters'),
  certifications: z.array(z.string())
});

export const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const caseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  practiceArea: z.enum(['Corporate', 'Litigation', 'Intellectual Property', 'Real Estate', 'Employment']),
  billableHours: z.number().min(0, 'Billable hours must be positive'),
  deadlines: z.array(z.object({
    date: z.date(),
    description: z.string().min(5, 'Deadline description required')
  }))
});
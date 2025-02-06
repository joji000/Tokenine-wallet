import { z } from 'zod';

export const updateUserConfigDto = z.object({
  prefix: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.string().optional(), // Assuming dob is a string in 'DD/MM/YYYY' format
  idNumber: z.string().optional(),
});
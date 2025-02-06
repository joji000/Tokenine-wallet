import { z } from 'zod';

export const updateAddressDto = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
});
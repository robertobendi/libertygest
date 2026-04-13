import { z } from "zod";
import { LANGUAGES } from "./enums";

// Multilingual text field — { it: "...", en: "...", de: "...", fr: "..." }
export const multilingualSchema = z.object({
  it: z.string().default(""),
  en: z.string().default(""),
  de: z.string().default(""),
  fr: z.string().default(""),
});
export type MultilingualText = z.infer<typeof multilingualSchema>;

// Address
export const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});
export type Address = z.infer<typeof addressSchema>;

// Room type creation
export const createRoomTypeSchema = z.object({
  name: multilingualSchema,
  capacity: z.number().int().min(1).max(20),
  maxOtaAvailability: z.number().int().min(0).optional(),
  description: multilingualSchema.optional(),
  amenities: z.array(z.string()).default([]),
});

// Room creation
export const createRoomSchema = z.object({
  roomTypeId: z.string().uuid(),
  number: z.string().min(1).max(10),
  floor: z.number().int(),
});

// Reservation creation
export const createReservationSchema = z.object({
  guestId: z.string().uuid(),
  checkIn: z.string().date(),
  checkOut: z.string().date(),
  adults: z.number().int().min(1).max(10),
  children: z.number().int().min(0).max(10).default(0),
  roomTypeId: z.string().uuid(),
  ratePlanId: z.string().uuid().optional(),
  notes: z.string().max(2000).optional(),
});

// Guest creation
export const createGuestSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  nationality: z.string().length(2).optional(),
  documentType: z.enum(["passport", "id_card", "driving_license"]).optional(),
  documentNumber: z.string().max(50).optional(),
  language: z.enum(LANGUAGES).default("it"),
});

// Cancellation policy tier
export const cancellationTierSchema = z.object({
  daysBeforeArrival: z.number().int().min(0),
  refundPercent: z.number().min(0).max(100),
});

// Rate plan creation
export const createRatePlanSchema = z.object({
  name: multilingualSchema,
  type: z.enum(["primary", "derived"]),
  parentPlanId: z.string().uuid().optional(),
  derivedDeltaValue: z.number().optional(),
  derivedDeltaType: z.enum(["percentage", "fixed"]).optional(),
  includedExtras: z.array(z.string().uuid()).default([]),
  roomTypeIds: z.array(z.string().uuid()).default([]),
  cancellationPolicy: z.array(cancellationTierSchema).default([]),
  isActive: z.boolean().default(true),
});

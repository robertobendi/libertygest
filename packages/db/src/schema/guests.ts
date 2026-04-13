import { pgTable, uuid, text, char, date, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";

export const guests = pgTable("guests", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  dateOfBirth: date("date_of_birth"),
  nationality: char("nationality", { length: 2 }), // ISO 3166-1 alpha-2
  documentType: text("document_type"), // passport, id_card, driving_license
  documentNumber: text("document_number"),
  language: char("language", { length: 2 }).default("it"),
  address: jsonb("address").default({}), // street, city, zip, country
  company: text("company"),
  vatNumber: text("vat_number"),
  preferences: jsonb("preferences").default({}), // allergies, room_pref, etc.
  tags: jsonb("tags").default([]), // ["vip","returning","business"]
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const guestMergeCandidates = pgTable("guest_merge_candidates", {
  id: uuid("id").primaryKey().defaultRandom(),
  guestIdA: uuid("guest_id_a").notNull().references(() => guests.id),
  guestIdB: uuid("guest_id_b").notNull().references(() => guests.id),
  matchScore: text("match_score").notNull(), // high, medium, low
  matchFields: jsonb("match_fields").notNull().default([]), // ["email","phone","name_fuzzy"]
  status: text("status").notNull().default("pending"), // pending, merged, dismissed
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  resolvedBy: uuid("resolved_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

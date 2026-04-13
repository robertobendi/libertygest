import { pgTable, uuid, text, integer, jsonb, timestamp, boolean, unique } from "drizzle-orm/pg-core";
import { properties } from "./properties";

export const roomTypes = pgTable("room_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  name: jsonb("name").notNull(), // {"it":"Doppia Standard","en":"Double Standard","de":"Doppelzimmer Standard","fr":"Double Standard"}
  slug: text("slug").notNull(),
  capacity: integer("capacity").notNull().default(2),
  maxOtaAvailability: integer("max_ota_availability"),
  description: jsonb("description").notNull().default({}), // multilingual
  amenities: jsonb("amenities").notNull().default([]), // ["wifi","minibar","tv",...]
  beds: jsonb("beds").notNull().default({}), // multilingual bed description
  images: jsonb("images").notNull().default([]), // [{url, alt, order}]
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  unique("uq_room_type_property_slug").on(t.propertyId, t.slug),
]);

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  roomTypeId: uuid("room_type_id").notNull().references(() => roomTypes.id),
  number: text("number").notNull(), // "101", "A2", etc.
  floor: integer("floor").notNull(),
  status: text("status").notNull().default("available"), // available, occupied, cleaning, maintenance, out_of_order
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  unique("uq_room_property_number").on(t.propertyId, t.number),
]);

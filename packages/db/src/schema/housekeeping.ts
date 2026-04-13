import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { rooms } from "./rooms";

export const housekeepingEvents = pgTable("housekeeping_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id),
  roomId: uuid("room_id").notNull().references(() => rooms.id),
  statusFrom: text("status_from").notNull(),
  statusTo: text("status_to").notNull(),
  staffUserId: uuid("staff_user_id"),
  notes: text("notes"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const housekeepingStaff = pgTable("housekeeping_staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  isActive: text("is_active").notNull().default("true"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

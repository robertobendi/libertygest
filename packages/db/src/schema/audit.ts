import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id"),
  userId: uuid("user_id"),
  tableName: text("table_name").notNull(),
  recordId: uuid("record_id").notNull(),
  action: text("action").notNull(), // INSERT, UPDATE, DELETE
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const communicationLog = pgTable("communication_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull(),
  reservationId: uuid("reservation_id"),
  guestId: uuid("guest_id"),
  type: text("type").notNull(), // email, sms, note
  direction: text("direction").notNull().default("outbound"), // inbound, outbound, internal
  subject: text("subject"),
  body: text("body"),
  recipientEmail: text("recipient_email"),
  status: text("status").notNull().default("sent"), // draft, sent, delivered, failed, opened
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

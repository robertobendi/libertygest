import { pgTable, uuid, text, integer, date, numeric, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { rooms, roomTypes } from "./rooms";
import { guests } from "./guests";

export const reservations = pgTable("reservations", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id),
  confirmationCode: text("confirmation_code").unique().notNull(),
  guestId: uuid("guest_id").notNull().references(() => guests.id),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  adults: integer("adults").notNull().default(1),
  children: integer("children").notNull().default(0),
  channel: text("channel").notNull().default("direct"), // direct, booking_com, expedia, admin, kiosk
  status: text("status").notNull().default("confirmed"), // pending, confirmed, checked_in, checked_out, cancelled, no_show
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, partial, paid, refunded
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  paidAmount: numeric("paid_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("EUR"),
  ratePlanId: uuid("rate_plan_id"),
  promotionId: uuid("promotion_id"),
  voucherCode: text("voucher_code"),
  notes: text("notes"),
  internalNotes: text("internal_notes"),
  guestPreferences: jsonb("guest_preferences").default({}),
  checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
  checkedOutAt: timestamp("checked_out_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  cancellationReason: text("cancellation_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reservationRooms = pgTable("reservation_rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  reservationId: uuid("reservation_id").notNull().references(() => reservations.id, { onDelete: "cascade" }),
  roomId: uuid("room_id").references(() => rooms.id),
  roomTypeId: uuid("room_type_id").notNull().references(() => roomTypes.id),
  adults: integer("adults").notNull().default(1),
  children: integer("children").notNull().default(0),
  ratePerNight: numeric("rate_per_night", { precision: 10, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id),
  reservationId: uuid("reservation_id").notNull().references(() => reservations.id),
  orderNumber: text("order_number").unique().notNull(),
  type: text("type").notNull().default("accommodation"), // accommodation, extra, tax, refund
  description: text("description"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  vatRate: numeric("vat_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  vatAmount: numeric("vat_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, refunded, cancelled
  paymentMethod: text("payment_method"), // cash, card, bank_transfer, ota_collected
  invoiceRef: text("invoice_ref"),
  dueDate: date("due_date"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

import { pgTable, uuid, text, integer, numeric, date, jsonb, timestamp, boolean, unique } from "drizzle-orm/pg-core";
import { properties } from "./properties";
import { roomTypes } from "./rooms";

export const ratePlans = pgTable("rate_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  name: jsonb("name").notNull(), // multilingual
  type: text("type").notNull().default("primary"), // primary, derived
  parentPlanId: uuid("parent_plan_id").references((): any => ratePlans.id),
  derivedDeltaValue: numeric("derived_delta_value", { precision: 10, scale: 2 }),
  derivedDeltaType: text("derived_delta_type"), // percentage, fixed
  restrictionPlanId: uuid("restriction_plan_id"),
  includedExtras: jsonb("included_extras").notNull().default([]), // [extra_id, ...]
  roomTypeIds: jsonb("room_type_ids").notNull().default([]), // [room_type_id, ...]
  cancellationPolicy: jsonb("cancellation_policy").notNull().default([]), // [{daysBeforeArrival: 7, refundPercent: 100}]
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Default prices per room type per rate plan
export const priceDefaults = pgTable("price_defaults", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  ratePlanId: uuid("rate_plan_id").notNull().references(() => ratePlans.id, { onDelete: "cascade" }),
  roomTypeId: uuid("room_type_id").notNull().references(() => roomTypes.id),
  minPrice: numeric("min_price", { precision: 10, scale: 2 }).notNull(),
  maxPrice: numeric("max_price", { precision: 10, scale: 2 }).notNull(),
  perPersonDiscount: numeric("per_person_discount", { precision: 10, scale: 2 }).notNull().default("0"),
}, (t) => [
  unique("uq_price_default").on(t.ratePlanId, t.roomTypeId),
]);

// Sparse calendar overrides (only dates that differ from defaults)
export const priceCalendar = pgTable("price_calendar", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  ratePlanId: uuid("rate_plan_id").notNull().references(() => ratePlans.id, { onDelete: "cascade" }),
  roomTypeId: uuid("room_type_id").notNull().references(() => roomTypes.id),
  date: date("date").notNull(),
  minPrice: numeric("min_price", { precision: 10, scale: 2 }),
  maxPrice: numeric("max_price", { precision: 10, scale: 2 }),
  perPersonDiscount: numeric("per_person_discount", { precision: 10, scale: 2 }),
}, (t) => [
  unique("uq_price_calendar").on(t.ratePlanId, t.roomTypeId, t.date),
]);

// Dynamic pricing algorithm configuration
export const pricingAlgorithm = pgTable("pricing_algorithm", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  occupancyBands: jsonb("occupancy_bands").notNull().default([]), // [{threshold: 11, points: 2}, ...]
  leadTimeBands: jsonb("lead_time_bands").notNull().default([]), // [{threshold: 10, points: 10}, ...]
  weekendPoints: integer("weekend_points").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Extras / Supplements
export const extras = pgTable("extras", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  name: jsonb("name").notNull(), // multilingual
  slug: text("slug").notNull(),
  category: text("category").notNull().default("service"), // service, tax, amenity
  vatRate: numeric("vat_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  icon: text("icon"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  unique("uq_extra_property_slug").on(t.propertyId, t.slug),
]);

// Extra pricing by date range
export const extraPrices = pgTable("extra_prices", {
  id: uuid("id").primaryKey().defaultRandom(),
  extraId: uuid("extra_id").notNull().references(() => extras.id, { onDelete: "cascade" }),
  dateFrom: date("date_from").notNull(),
  dateTo: date("date_to").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// VAT configuration per property
export const vatConfig = pgTable("vat_config", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  category: text("category").notNull(), // room, breakfast, pool, etc.
  vatRate: numeric("vat_rate", { precision: 5, scale: 2 }).notNull(),
}, (t) => [
  unique("uq_vat_config").on(t.propertyId, t.category),
]);

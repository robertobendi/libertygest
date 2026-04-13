import { pgTable, uuid, text, char, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  currency: char("currency", { length: 3 }).notNull().default("EUR"),
  timezone: text("timezone").notNull().default("Europe/Rome"),
  countryCode: char("country_code", { length: 2 }).notNull(),
  vatNumber: text("vat_number"),
  iban: text("iban"),
  address: jsonb("address").notNull().default({}),
  contact: jsonb("contact").notNull().default({}),
  wifi: jsonb("wifi").notNull().default({}),
  brandColor: char("brand_color", { length: 7 }),
  settings: jsonb("settings").notNull().default({}),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const propertyRegulatory = pgTable("property_regulatory", {
  propertyId: uuid("property_id").primaryKey().references(() => properties.id, { onDelete: "cascade" }),
  hestaEmail: text("hesta_email"),
  hestaPhone: text("hesta_phone"),
  hestaContact: text("hesta_contact"),
  hestaUstId: text("hesta_ust_id"),
  hestaAutoSend: boolean("hesta_auto_send").notNull().default(false),
  polcaCode: text("polca_code"),
  istatCode: text("istat_code"),
  gateOpenerPhone: text("gate_opener_phone"),
});

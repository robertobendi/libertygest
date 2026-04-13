export const ROOM_STATUS = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  CLEANING: "cleaning",
  MAINTENANCE: "maintenance",
  OUT_OF_ORDER: "out_of_order",
} as const;

export const RESERVATION_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CHECKED_IN: "checked_in",
  CHECKED_OUT: "checked_out",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PARTIAL: "partial",
  PAID: "paid",
  REFUNDED: "refunded",
} as const;

export const CHANNEL = {
  DIRECT: "direct",
  ADMIN: "admin",
  BOOKING_COM: "booking_com",
  EXPEDIA: "expedia",
  KIOSK: "kiosk",
} as const;

export const RATE_PLAN_TYPE = {
  PRIMARY: "primary",
  DERIVED: "derived",
} as const;

export const USER_ROLE = {
  OWNER: "owner",
  ADMIN: "admin",
  REVENUE_MANAGER: "revenue_manager",
  FRONT_DESK: "front_desk",
  HOUSEKEEPER: "housekeeper",
  ACCOUNTANT: "accountant",
  READONLY: "readonly",
} as const;

export const LANGUAGES = ["it", "en", "de", "fr"] as const;
export type Language = typeof LANGUAGES[number];

export type RoomStatus = typeof ROOM_STATUS[keyof typeof ROOM_STATUS];
export type ReservationStatus = typeof RESERVATION_STATUS[keyof typeof RESERVATION_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
export type Channel = typeof CHANNEL[keyof typeof CHANNEL];
export type RatePlanType = typeof RATE_PLAN_TYPE[keyof typeof RATE_PLAN_TYPE];
export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

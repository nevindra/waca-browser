import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  real,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

export const formatEnum = pgEnum("format", ["EPUB", "PDF"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  username: varchar("username").notNull().unique(),
  role: varchar("role").notNull().default("user"),
  profilePhotoUrl: varchar("profile_photo_url"),
  preferences: jsonb("preferences").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userBooks = pgTable("user_books", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  isbn: varchar("isbn"),
  format: formatEnum("format").notNull(),
  fileUrl: varchar("file_url").notNull(),
  isStarred: boolean("is_starred").default(false),
  currentPage: integer("current_page").default(0),
  readingProgress: real("reading_progress").default(0),
  lastRead: timestamp("last_read"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notes = pgTable("notes", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  userBookId: uuid("user_book_id")
    .references(() => userBooks.id)
    .notNull(),
  highlightsId: uuid("highlights_id")
    .references(() => highlights.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const highlights = pgTable("highlights", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  userBookId: uuid("user_book_id")
    .references(() => userBooks.id)
    .notNull(),
  content: text("content").notNull(),
  cfiRange: varchar("cfi_range"), // For EPUB
  pageNumber: integer("page_number"), // For PDF
  xOffset: real("x_offset"), // For PDF
  yOffset: real("y_offset"), // For PDF
  width: real("width"), // For PDF
  height: real("height"), // For PDF
  color: varchar("color").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  role: varchar("role").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
});

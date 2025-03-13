import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password_hash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin", "manager", "supplier", "customer"] })
    .notNull(),
  created_at: text("created_at").notNull().default(new Date().toUTCString()),
  updated_at: text("updated_at").notNull().default(new Date().toUTCString())
    .$onUpdate(() => new Date().toUTCString()),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  stock: integer("stock").notNull(),
  warehouse_id: integer("warehouse_id").references(() => warehouses.id),
  supplier_id: integer("supplier_id").references(() => suppliers.id),
  created_at: text("created_at").notNull().default(new Date().toUTCString()),
  updated_at: text("updated_at").notNull().default(new Date().toUTCString())
    .$onUpdate(() => new Date().toUTCString()),
});

export const warehouses = sqliteTable("warehouses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  location: text("location").notNull(),
  created_at: text("created_at").notNull().default(new Date().toUTCString()),
  updated_at: text("updated_at").notNull().default(new Date().toUTCString())
    .$onUpdate(() => new Date().toUTCString()),
});

export const inventory = sqliteTable("inventory", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  warehouse_id: integer("warehouse_id").references(() => warehouses.id)
    .notNull(),
  product_id: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  last_updated: text("last_updated").notNull().$onUpdateFn(() =>
    new Date().toUTCString()
  ),
});

export const suppliers = sqliteTable("suppliers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  contact_info: text("contact_info").notNull(),
  address: text("address").notNull(),
  created_at: text("created_at").notNull().default(new Date().toUTCString()),
  updated_at: text("updated_at").notNull().default(new Date().toUTCString())
    .$onUpdate(() => new Date().toUTCString()),
});

export const replenishments = sqliteTable("replenishments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  product_id: integer("product_id").references(() => products.id).notNull(),
  supplier_id: integer("supplier_id").references(() => suppliers.id).notNull(),
  quantity: integer("quantity").notNull(),
  status: text("status", {
    enum: [
      "pending",
      "completed",
      "canceled",
    ],
  }).notNull(),
  created_at: text("created_at").notNull().default(new Date().toUTCString()),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: integer("user_id").references(() => users.id).notNull(),
  total_price: real("total_price").notNull(),
  status: text("status", {
    enum: [
      "pending",
      "paid",
      "shipped",
      "delivered",
      "canceled",
    ],
  }).notNull(),
  created_at: text("created_at").notNull().default(new Date().toUTCString()),
  updated_at: text("updated_at").notNull().default(new Date().toUTCString())
    .$onUpdate(() => new Date().toUTCString()),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  order_id: integer("order_id").references(() => orders.id).notNull(),
  product_id: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  subtotal: real("subtotal").notNull(),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  order_id: integer("order_id").references(() => orders.id).notNull(),
  amount: real("amount").notNull(),
  status: text("status", { enum: ["pending", "completed", "failed"] })
    .notNull(),
  payment_method: text("payment_method", {
    enum: [
      "credit_card",
      "paypal",
      "bank_transfer",
    ],
  }).notNull(),
  created_at: text("created_at").notNull().default(new Date().toUTCString()),
});

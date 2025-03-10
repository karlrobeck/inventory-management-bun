import { sql } from "drizzle-orm";
import { db } from ".";
import {
  inventory,
  orderItems,
  orders,
  products,
  replenishments,
  suppliers,
  transactions,
  users,
  warehouses,
} from "./schema";
import { faker } from "@faker-js/faker";

// user management
for (const role of ["admin", "manager", "supplier"]) {
  try {
    await db.insert(users).values({
      email: `${role}@email.com`,
      password_hash: await Bun.password.hash(`${role}-123`),
      name: faker.person.fullName(),
      role: role as any,
    }).execute();
  } catch {
    continue;
  }
}

console.log("INFO", "test users complete");

for (let i = 0; i < 1000; i++) {
  try {
    await db.insert(users).values({
      email: faker.internet.email(),
      password_hash: await Bun.password.hash(faker.internet.password()),
      name: faker.person.fullName(),
      role: "customer",
    }).execute();
  } catch {
    continue;
  }
}

console.log("INFO", "fake user complete");

// suppliers
for (let i = 0; i < 100; i++) {
  try {
    await db.insert(suppliers).values({
      name: faker.company.name(),
      contact_info: faker.phone.number(),
      address: faker.address.streetAddress(),
    }).execute();
  } catch {
    continue;
  }
}

console.log("INFO", "fake supplier complete");

// warehouses
for (let i = 0; i < 20; i++) {
  try {
    await db.insert(warehouses).values({
      name: faker.company.name(),
      location: faker.address.city(),
    }).execute();
  } catch {
    continue;
  }
}

console.log("INFO", "fake warehouses complete");

const warehouses_ = db.select().from(warehouses).all();
const suppliers_ = db.select().from(suppliers).all();

// products
for (let i = 0; i < 100; i++) {
  try {
    await db.insert(products).values({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      stock: faker.helpers.rangeToNumber({ min: 0, max: 100 }),
      warehouse_id:
        faker.helpers.arrayElement(db.select().from(warehouses).all()).id,
      supplier_id: faker.helpers.arrayElement(suppliers_).id,
    }).execute();
  } catch {
    continue;
  }
}

console.log("INFO", "fake products complete");

const products_ = db.select().from(products).all();

// inventory
for (let i = 0; i < 20; i++) {
  try {
    await db.insert(inventory).values({
      warehouse_id: faker.helpers.arrayElement(warehouses_).id,
      product_id: faker.helpers.arrayElement(products_).id,
      quantity: faker.helpers.rangeToNumber({ min: 0, max: 100 }),
      last_updated: new Date().toISOString(),
    }).execute();
  } catch {
    continue;
  }
}

console.log("INFO", "fake inventory complete");

const users_ = db.select().from(users).where(sql`${users.role} = "customer"`)
  .all();

// orders
for (let i = 0; i < 15; i++) {
  try {
    await db.insert(orders).values({
      user_id: faker.helpers.arrayElement(users_).id,
      total_price: parseFloat(faker.commerce.price()),
      status: faker.helpers.arrayElement([
        "pending",
        "paid",
        "shipped",
        "delivered",
        "canceled",
      ]),
    }).execute();
  } catch {
    continue;
  }
}

console.log("INFO", "fake orders complete");

const orders_ = db.select().from(orders).all();

// order items
for (let i = 0; i < 50; i++) {
  try {
    await db.insert(orderItems).values({
      order_id: faker.helpers.arrayElement(orders_).id,
      product_id: faker.helpers.arrayElement(products_).id,
      quantity: faker.helpers.rangeToNumber({ min: 1, max: 100 }),
      subtotal: parseFloat(faker.commerce.price()),
    }).execute();
  } catch {
    continue;
  }
}

console.log("INFO", "fake orders items complete");

// transactions
for (let i = 0; i < 20; i++) {
  try {
    await db.insert(transactions).values({
      order_id: faker.helpers.arrayElement(orders_).id,
      amount: parseFloat(faker.commerce.price()),
      status: faker.helpers.arrayElement(["pending", "completed", "failed"]),
      payment_method: faker.helpers.arrayElement([
        "credit_card",
        "paypal",
        "bank_transfer",
      ]),
    }).execute();
  } catch {
    continue;
  }
}

console.log("INFO", "fake transactions complete");

// replenishments
for (let i = 0; i < 10; i++) {
  try {
    await db.insert(replenishments).values({
      product_id: faker.helpers.arrayElement(products_).id,
      supplier_id: faker.helpers.arrayElement(suppliers_).id,
      quantity: faker.helpers.rangeToNumber({ min: 1, max: 100 }),
      status: faker.helpers.arrayElement(["pending", "completed", "canceled"]),
    }).execute();
  } catch {
    continue;
  }
}

console.log("INFO", "fake replenishment complete");

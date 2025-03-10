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
      email: faker.internet.email(),
      password_hash: await Bun.password.hash(`${role}-123`),
      name: faker.person.fullName(),
      role: role as any,
    }).execute();
  } catch {
    continue;
  }
}

// suppliers
for (let i = 0; i < 10; i++) {
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

// warehouses
for (let i = 0; i < 5; i++) {
  try {
    await db.insert(warehouses).values({
      name: faker.company.name(),
      location: faker.address.city(),
    }).execute();
  } catch {
    continue;
  }
}

// products
for (let i = 0; i < 20; i++) {
  try {
    await db.insert(products).values({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      stock: faker.helpers.rangeToNumber({ min: 0, max: 100 }),
      warehouse_id: faker.helpers.rangeToNumber({ min: 1, max: 5 }),
      supplier_id: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
    }).execute();
  } catch {
    continue;
  }
}

// inventory
for (let i = 0; i < 20; i++) {
  try {
    await db.insert(inventory).values({
      warehouse_id: faker.helpers.rangeToNumber({ min: 1, max: 5 }),
      product_id: faker.helpers.rangeToNumber({ min: 1, max: 20 }),
      quantity: faker.helpers.rangeToNumber({ min: 0, max: 100 }),
      last_updated: new Date().toISOString(),
    }).execute();
  } catch {
    continue;
  }
}

// orders
for (let i = 0; i < 15; i++) {
  try {
    await db.insert(orders).values({
      user_id: faker.helpers.rangeToNumber({ min: 1, max: 3 }),
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

// order items
for (let i = 0; i < 50; i++) {
  try {
    await db.insert(orderItems).values({
      order_id: faker.helpers.rangeToNumber({ min: 1, max: 15 }),
      product_id: faker.helpers.rangeToNumber({ min: 1, max: 20 }),
      quantity: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
      subtotal: parseFloat(faker.commerce.price()),
    }).execute();
  } catch {
    continue;
  }
}

// transactions
for (let i = 0; i < 20; i++) {
  try {
    await db.insert(transactions).values({
      order_id: faker.helpers.rangeToNumber({ min: 1, max: 15 }),
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

// replenishments
for (let i = 0; i < 10; i++) {
  try {
    await db.insert(replenishments).values({
      product_id: faker.helpers.rangeToNumber({ min: 1, max: 20 }),
      supplier_id: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
      quantity: faker.helpers.rangeToNumber({ min: 1, max: 100 }),
      status: faker.helpers.arrayElement(["pending", "completed", "canceled"]),
    }).execute();
  } catch {
    continue;
  }
}

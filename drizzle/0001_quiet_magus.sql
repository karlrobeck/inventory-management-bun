PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`warehouse_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`last_updated` text NOT NULL,
	FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_inventory`("id", "warehouse_id", "product_id", "quantity", "last_updated") SELECT "id", "warehouse_id", "product_id", "quantity", "last_updated" FROM `inventory`;--> statement-breakpoint
DROP TABLE `inventory`;--> statement-breakpoint
ALTER TABLE `__new_inventory` RENAME TO `inventory`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`subtotal` real NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_order_items`("id", "order_id", "product_id", "quantity", "subtotal") SELECT "id", "order_id", "product_id", "quantity", "subtotal" FROM `order_items`;--> statement-breakpoint
DROP TABLE `order_items`;--> statement-breakpoint
ALTER TABLE `__new_order_items` RENAME TO `order_items`;--> statement-breakpoint
CREATE TABLE `__new_orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`total_price` real NOT NULL,
	`status` text NOT NULL,
	`created_at` text DEFAULT '1741617454061' NOT NULL,
	`updated_at` text DEFAULT '1741617454061' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_orders`("id", "user_id", "total_price", "status", "created_at", "updated_at") SELECT "id", "user_id", "total_price", "status", "created_at", "updated_at" FROM `orders`;--> statement-breakpoint
DROP TABLE `orders`;--> statement-breakpoint
ALTER TABLE `__new_orders` RENAME TO `orders`;--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`price` real NOT NULL,
	`stock` integer NOT NULL,
	`warehouse_id` integer,
	`supplier_id` integer,
	`created_at` text DEFAULT '1741617454060' NOT NULL,
	`updated_at` text DEFAULT '1741617454060' NOT NULL,
	FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "name", "description", "price", "stock", "warehouse_id", "supplier_id", "created_at", "updated_at") SELECT "id", "name", "description", "price", "stock", "warehouse_id", "supplier_id", "created_at", "updated_at" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
CREATE TABLE `__new_replenishments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`supplier_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`status` text NOT NULL,
	`created_at` text DEFAULT '1741617454061' NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_replenishments`("id", "product_id", "supplier_id", "quantity", "status", "created_at") SELECT "id", "product_id", "supplier_id", "quantity", "status", "created_at" FROM `replenishments`;--> statement-breakpoint
DROP TABLE `replenishments`;--> statement-breakpoint
ALTER TABLE `__new_replenishments` RENAME TO `replenishments`;--> statement-breakpoint
CREATE TABLE `__new_suppliers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`contact_info` text NOT NULL,
	`address` text NOT NULL,
	`created_at` text DEFAULT '1741617454061' NOT NULL,
	`updated_at` text DEFAULT '1741617454061' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_suppliers`("id", "name", "contact_info", "address", "created_at", "updated_at") SELECT "id", "name", "contact_info", "address", "created_at", "updated_at" FROM `suppliers`;--> statement-breakpoint
DROP TABLE `suppliers`;--> statement-breakpoint
ALTER TABLE `__new_suppliers` RENAME TO `suppliers`;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`amount` real NOT NULL,
	`status` text NOT NULL,
	`payment_method` text NOT NULL,
	`created_at` text DEFAULT '1741617454061' NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "order_id", "amount", "status", "payment_method", "created_at") SELECT "id", "order_id", "amount", "status", "payment_method", "created_at" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text NOT NULL,
	`created_at` text DEFAULT '1741617454059' NOT NULL,
	`updated_at` text DEFAULT '1741617454059' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password_hash", "role", "created_at", "updated_at") SELECT "id", "name", "email", "password_hash", "role", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `__new_warehouses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`location` text NOT NULL,
	`created_at` text DEFAULT '1741617454061' NOT NULL,
	`updated_at` text DEFAULT '1741617454061' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_warehouses`("id", "name", "location", "created_at", "updated_at") SELECT "id", "name", "location", "created_at", "updated_at" FROM `warehouses`;--> statement-breakpoint
DROP TABLE `warehouses`;--> statement-breakpoint
ALTER TABLE `__new_warehouses` RENAME TO `warehouses`;
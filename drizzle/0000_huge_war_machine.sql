CREATE TABLE `inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`warehouse_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`last_updated` text NOT NULL,
	FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`subtotal` real NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`total_price` real NOT NULL,
	`status` text NOT NULL,
	`created_at` text DEFAULT 'Thu, 13 Mar 2025 06:22:17 GMT' NOT NULL,
	`updated_at` text DEFAULT 'Thu, 13 Mar 2025 06:22:17 GMT' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`price` real NOT NULL,
	`stock` integer NOT NULL,
	`warehouse_id` integer,
	`supplier_id` integer,
	`created_at` text DEFAULT 'Thu, 13 Mar 2025 06:22:17 GMT' NOT NULL,
	`updated_at` text DEFAULT 'Thu, 13 Mar 2025 06:22:17 GMT' NOT NULL,
	FOREIGN KEY (`warehouse_id`) REFERENCES `warehouses`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `replenishments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`supplier_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`status` text NOT NULL,
	`created_at` text DEFAULT 'Thu, 13 Mar 2025 06:22:17 GMT' NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_id`) REFERENCES `suppliers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`contact_info` text NOT NULL,
	`address` text NOT NULL,
	`created_at` text DEFAULT 'Thu, 13 Mar 2025 06:22:17 GMT' NOT NULL,
	`updated_at` text DEFAULT 'Thu, 13 Mar 2025 06:22:17 GMT' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`amount` real NOT NULL,
	`status` text NOT NULL,
	`payment_method` text NOT NULL,
	`created_at` text DEFAULT 'Thu, 13 Mar 2025 06:22:17 GMT' NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text NOT NULL,
	`created_at` text DEFAULT 'Thu, 13 Mar 2025 06:22:17 GMT' NOT NULL,
	`updated_at` text DEFAULT 'Thu, 13 Mar 2025 06:22:17 GMT' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `warehouses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`location` text NOT NULL,
	`created_at` text DEFAULT 'Thu, 13 Mar 2025 06:22:17 GMT' NOT NULL,
	`updated_at` text DEFAULT 'Thu, 13 Mar 2025 06:22:17 GMT' NOT NULL
);

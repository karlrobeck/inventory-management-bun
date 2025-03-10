## API Enpoints

### Authentication API

```mermaid
graph LR;
  A[Authentication] -->|Register| A1["POST /auth/register"]
  A -->|Login| A2["POST /auth/login"]
  A -->|Logout| A3["POST /auth/logout"]
  A -->|Get User| A4["GET /users/{id}"]
```

---

### Product Management API

```mermaid
graph LR;
  B[Products] -->|List Products| B1["GET /products"]
  B -->|Get Product| B2["GET /products/{id}"]
  B -->|Create Product| B3["POST /products"]
  B -->|Update Product| B4["PUT /products/{id}"]
  B -->|Delete Product| B5["DELETE /products/{id}"]
```

---

### Warehouse & Inventory API

```mermaid
graph LR;
  C[Warehouse Inventory] -->|List Warehouses| C1["GET /warehouses"]
  C -->|Get Warehouse| C2["GET /warehouses/{id}"]
  C -->|Create Warehouse| C3["POST /warehouses"]
  C -->|Update Warehouse| C4["PUT /warehouses/{id}"]
  C -->|Delete Warehouse| C5["DELETE /warehouses/{id}"]
  C -->|Get Inventory| C6["GET /inventory/{warehouse_id}"]
  C -->|Add Inventory| C7["POST /inventory/{warehouse_id}"]
  C -->|Update Inventory| C8["PUT /inventory/{warehouse_id}/{product_id}"]
```

---

### Supplier & Replenishment API

```mermaid
graph LR;
  D[Suppliers & Replenishments] -->|List Suppliers| D1["GET /suppliers"]
  D -->|Get Supplier| D2["GET /suppliers/{id}"]
  D -->|Create Supplier| D3["POST /suppliers"]
  D -->|Update Supplier| D4["PUT /suppliers/{id}"]
  D -->|Delete Supplier| D5["DELETE /suppliers/{id}"]
  D -->|Create Replenishment| D6["POST /replenishments"]
  D -->|Get Replenishment| D7["GET /replenishments/{id}"]
```

---

### Orders & Transactions API

```mermaid
graph LR;
  E[Orders & Transactions] -->|List Orders| E1["GET /orders"]
  E -->|Get Order| E2["GET /orders/{id}"]
  E -->|Create Order| E3["POST /orders"]
  E -->|Update Order| E4["PUT /orders/{id}"]
  E -->|Delete Order| E5["DELETE /orders/{id}"]
  E -->|Create Transaction| E6["POST /transactions"]
  E -->|Get Transaction| E7["GET /transactions/{id}"]
```

## User Flow's

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant System

    User->>System: POST /auth/register
    System-->>User: Registration Success/Failure
    
    User->>System: POST /auth/login
    System-->>User: Authentication Success/Failure

    User->>System: POST /auth/logout
    System-->>User: Logout Success
```

---

### Product Management

```mermaid
sequenceDiagram
    participant User
    participant System

    User->>System: GET /products
    System-->>User: Returns product list
    
    User->>System: POST /products
    System-->>User: Product Created
    
    User->>System: PUT /products/{id}
    System-->>User: Product Updated
    
    User->>System: DELETE /products/{id}
    System-->>User: Product Deleted
```

---

### Warehouse and Inventory Management

```mermaid
sequenceDiagram
    participant User
    participant System

    User->>System: GET /warehouses
    System-->>User: Returns warehouse list
    
    User->>System: GET /inventory/{warehouse_id}
    System-->>User: Returns inventory details
    
    User->>System: PUT /inventory/{warehouse_id}/{product_id}
    System-->>User: Inventory Updated
```

---

### Supplier and Replenishment

```mermaid
sequenceDiagram
    participant User
    participant System
    participant Supplier

    User->>System: GET /suppliers
    System-->>User: Returns supplier list
    
    User->>System: POST /replenishments
    System->>Supplier: Sends replenishment request
    Supplier-->>System: Confirmation & ETA
    System-->>User: Replenishment Confirmed
```

---

### Order Processing

```mermaid
sequenceDiagram
    participant User
    participant System

    User->>System: POST /orders
    System-->>User: Order Created

    User->>System: GET /orders
    System-->>User: Returns order list

    User->>System: PUT /orders/{id}
    System-->>User: Order Updated

    User->>System: DELETE /orders/{id}
    System-->>User: Order Deleted
```

---

### Payments & Transactions

```mermaid
sequenceDiagram
    participant User
    participant System

    User->>System: POST /transactions
    System-->>User: Payment Success/Failure

    alt Payment Failed
        User->>System: Retry Payment
        System-->>User: Payment Processed
    end
```

---

## Entity Relationship Diagram

```mermaid
erDiagram
    USERS {
        int id "Primary Key"
        string name "Full name of the user"
        string email "Unique email address"
        string password_hash "Hashed password for security"
        string role "ENUM('admin', 'manager', 'supplier') - Defines user role"
        datetime created_at "Timestamp when user was created"
        datetime updated_at "Timestamp when user was last updated"
    }

    PRODUCTS {
        int id "Primary Key"
        string name "Product name"
        string description "Product details"
        float price "Price of the product"
        int stock "Total available stock"
        int warehouse_id "Foreign Key - Warehouse where product is stored"
        int supplier_id "Foreign Key - Supplier providing product (nullable)"
        datetime created_at "Timestamp when product was created"
        datetime updated_at "Timestamp when product was last updated"
    }

    WAREHOUSES {
        int id "Primary Key"
        string name "Warehouse name"
        string location "Physical address of warehouse"
        datetime created_at "Timestamp when warehouse was created"
        datetime updated_at "Timestamp when warehouse was last updated"
    }

    INVENTORY {
        int id "Primary Key"
        int warehouse_id "Foreign Key - Associated warehouse"
        int product_id "Foreign Key - Associated product"
        int quantity "Available stock in warehouse"
        datetime last_updated "Timestamp of last inventory update"
    }

    SUPPLIERS {
        int id "Primary Key"
        string name "Supplier name"
        string contact_info "Supplier email/phone"
        string address "Supplier location"
        datetime created_at "Timestamp when supplier was added"
        datetime updated_at "Timestamp when supplier was last updated"
    }

    REPLENISHMENTS {
        int id "Primary Key"
        int product_id "Foreign Key - Product being replenished"
        int supplier_id "Foreign Key - Supplier providing product"
        int quantity "Number of units replenished"
        string status "ENUM('pending', 'completed', 'canceled') - Replenishment status"
        datetime created_at "Timestamp when replenishment request was created"
    }

    ORDERS {
        int id "Primary Key"
        int user_id "Foreign Key - User who placed the order"
        float total_price "Total cost of order"
        string status "ENUM('pending', 'paid', 'shipped', 'delivered', 'canceled') - Order status"
        datetime created_at "Timestamp when order was created"
        datetime updated_at "Timestamp when order was last updated"
    }

    ORDER_ITEMS {
        int id "Primary Key"
        int order_id "Foreign Key - Associated order"
        int product_id "Foreign Key - Associated product"
        int quantity "Number of units ordered"
        float subtotal "Total cost of this item in order"
    }

    TRANSACTIONS {
        int id "Primary Key"
        int order_id "Foreign Key - Associated order"
        float amount "Total amount paid"
        string status "ENUM('pending', 'completed', 'failed') - Payment status"
        string payment_method "ENUM('credit_card', 'paypal', 'bank_transfer') - Payment type"
        datetime created_at "Timestamp when transaction was created"
    }

    USERS ||--o{ ORDERS : "places"
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    ORDER_ITEMS ||--|| PRODUCTS : "includes"
    PRODUCTS ||--o{ INVENTORY : "stored_in"
    INVENTORY ||--|| WAREHOUSES : "belongs_to"
    PRODUCTS ||--o| SUPPLIERS : "supplied_by"
    SUPPLIERS ||--o{ REPLENISHMENTS : "supplies"
    REPLENISHMENTS ||--|| PRODUCTS : "replenishes"
    ORDERS ||--o{ TRANSACTIONS : "paid_with"
```

## Access Control

| **Entity**         | **Operation**                                         | **Admin** | **Manager** | **Supplier** | **Customer** |
| ------------------ | ----------------------------------------------------- | --------- | ----------- | ------------ | ------------ |
| **Users**          | Create (`POST /auth/register`)                        | ❌        | ❌          | ❌           | ✅ (Self)    |
|                    | Read (`GET /users/{id}`)                              | ✅ (All)  | ✅ (Own)    | ✅ (Own)     | ✅ (Own)     |
|                    | Update (`PUT /users/{id}`)                            | ✅ (All)  | ✅ (Own)    | ✅ (Own)     | ✅ (Own)     |
|                    | Delete (`DELETE /users/{id}`)                         | ✅ (All)  | ❌          | ❌           | ❌           |
| **Products**       | Create (`POST /products`)                             | ✅        | ✅          | ❌           | ❌           |
|                    | Read (`GET /products/{id}`)                           | ✅        | ✅          | ✅           | ✅           |
|                    | Update (`PUT /products/{id}`)                         | ✅        | ✅          | ❌           | ❌           |
|                    | Delete (`DELETE /products/{id}`)                      | ✅        | ✅          | ❌           | ❌           |
| **Warehouses**     | Create (`POST /warehouses`)                           | ✅        | ✅          | ❌           | ❌           |
|                    | Read (`GET /warehouses/{id}`)                         | ✅        | ✅          | ❌           | ❌           |
|                    | Update (`PUT /warehouses/{id}`)                       | ✅        | ✅          | ❌           | ❌           |
|                    | Delete (`DELETE /warehouses/{id}`)                    | ✅        | ❌          | ❌           | ❌           |
| **Inventory**      | Read (`GET /inventory/{warehouse_id}`)                | ✅        | ✅          | ❌           | ❌           |
|                    | Add (`POST /inventory/{warehouse_id}`)                | ✅        | ✅          | ❌           | ❌           |
|                    | Update (`PUT /inventory/{warehouse_id}/{product_id}`) | ✅        | ✅          | ❌           | ❌           |
| **Suppliers**      | Create (`POST /suppliers`)                            | ✅        | ✅          | ✅ (Own)     | ❌           |
|                    | Read (`GET /suppliers/{id}`)                          | ✅        | ✅          | ✅ (Own)     | ❌           |
|                    | Update (`PUT /suppliers/{id}`)                        | ✅        | ✅          | ✅ (Own)     | ❌           |
|                    | Delete (`DELETE /suppliers/{id}`)                     | ✅        | ❌          | ❌           | ❌           |
| **Replenishments** | Create (`POST /replenishments`)                       | ✅        | ✅          | ✅ (Own)     | ❌           |
|                    | Read (`GET /replenishments/{id}`)                     | ✅        | ✅          | ✅ (Own)     | ❌           |
| **Orders**         | Create (`POST /orders`)                               | ✅        | ✅          | ❌           | ✅ (Own)     |
|                    | Read (`GET /orders/{id}`)                             | ✅        | ✅          | ❌           | ✅ (Own)     |
|                    | Update (`PUT /orders/{id}`)                           | ✅        | ✅          | ❌           | ❌           |
|                    | Delete (`DELETE /orders/{id}`)                        | ✅        | ✅          | ❌           | ❌           |
| **Order Items**    | Read (`GET /order_items/{id}`)                        | ✅        | ✅          | ❌           | ✅ (Own)     |
| **Transactions**   | Create (`POST /transactions`)                         | ✅        | ✅          | ❌           | ✅ (Own)     |
|                    | Read (`GET /transactions/{id}`)                       | ✅        | ✅          | ❌           | ✅ (Own)     |

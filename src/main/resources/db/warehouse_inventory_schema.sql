-- Users Table (for authentication and basic user information)
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'logistics_manager', 'warehouse_staff', 'delivery_driver') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- User Authentication Stored Procedures
DELIMITER //

-- User Signup Procedure
CREATE PROCEDURE UserSignup(
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_role ENUM('admin', 'logistics_manager', 'warehouse_staff', 'delivery_driver')
)
BEGIN
    INSERT INTO Users (username, email, password_hash, role) 
    VALUES (p_username, p_email, SHA2(p_password, 256), p_role);
END //

-- User Login Procedure
CREATE PROCEDURE UserLogin(
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(255)
)
BEGIN
    SELECT user_id, username, email, role 
    FROM Users 
    WHERE username = p_username 
    AND password_hash = SHA2(p_password, 256);
END //

DELIMITER ;

-- Warehouses Table
CREATE TABLE IF NOT EXISTS Warehouses (
    warehouse_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity DECIMAL(10,2) NOT NULL,
    manager_id INT,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (manager_id) REFERENCES Users(user_id)
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS Inventory (
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(100) NOT NULL,
    description TEXT,
    sku VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    reorder_point INT,
    reorder_quantity INT,
    unit_price DECIMAL(10,2),
    warehouse_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (warehouse_id) REFERENCES Warehouses(warehouse_id),
    UNIQUE KEY unique_sku_warehouse (sku, warehouse_id)
);

-- Inventory Transfers Table
CREATE TABLE IF NOT EXISTS InventoryTransfers (
    transfer_id INT PRIMARY KEY AUTO_INCREMENT,
    source_warehouse_id INT NOT NULL,
    destination_warehouse_id INT NOT NULL,
    inventory_id INT NOT NULL,
    quantity INT NOT NULL,
    status ENUM('PENDING', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    initiated_by INT,
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (source_warehouse_id) REFERENCES Warehouses(warehouse_id),
    FOREIGN KEY (destination_warehouse_id) REFERENCES Warehouses(warehouse_id),
    FOREIGN KEY (inventory_id) REFERENCES Inventory(inventory_id),
    FOREIGN KEY (initiated_by) REFERENCES Users(user_id)
);

-- Indexes for performance optimization
CREATE INDEX idx_inventory_warehouse ON Inventory(warehouse_id);
CREATE INDEX idx_inventory_reorder ON Inventory(reorder_point, quantity);
CREATE INDEX idx_transfer_source ON InventoryTransfers(source_warehouse_id);
CREATE INDEX idx_transfer_destination ON InventoryTransfers(destination_warehouse_id);
CREATE INDEX idx_transfer_status ON InventoryTransfers(status);

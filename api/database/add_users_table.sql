-- Add users table for custom authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  profile_image VARCHAR(500),
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);

-- Add foreign key constraints to existing tables
-- Update reservations table to link to users
ALTER TABLE reservations 
ADD COLUMN user_id INT,
ADD CONSTRAINT fk_reservations_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Update reviews table to link to users  
ALTER TABLE reviews 
ADD COLUMN user_id INT,
ADD CONSTRAINT fk_reviews_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

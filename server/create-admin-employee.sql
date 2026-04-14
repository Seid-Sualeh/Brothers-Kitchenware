-- Insert an admin user (run this in MySQL)
-- Password is 'Admin123!' (bcrypt hash)
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@bk.com', '$2b$10$WiCvvkrI1r4DM30L9jm6WeFPPhB4GbBxlTV1yF6YATZ4peQ3iDMkC', 'BK Admin', 'admin');

-- Insert an employee user (password 'Employee123')
INSERT INTO users (email, password_hash, name, role) VALUES
('employee@bk.com', '$2b$10$WiCvvkrI1r4DM30L9jm6WeFPPhB4GbBxlTV1yF6YATZ4peQ3iDMkC', 'BK Employee', 'employee');
-- CREATE TABLE User (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     email VARCHAR(150) NOT NULL UNIQUE,
--     password VARCHAR(255) NOT NULL,
--     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
--     updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );





-- INSERT INTO User (name, email, password) VALUES
-- ('Manish Sahni', 'manish@example.com', 'hashedpassword1'),
-- ('Rahul Verma', 'rahul@example.com', 'hashedpassword2'),
-- ('Priya Sharma', 'priya@example.com', 'hashedpassword3'),
-- ('Aman Gupta', 'aman@example.com', 'hashedpassword4'),
-- ('Neha Kapoor', 'neha@example.com', 'hashedpassword5');



SELECT * FROM User;
-- Create database
CREATE DATABASE IF NOT EXISTS learnhub;
USE learnhub;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- Courses table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    instructor VARCHAR(255)
);

-- Enrollments table
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    progress INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE KEY unique_enrollment (user_id, course_id)
);

-- Insert sample data
INSERT INTO courses (title, description, duration, instructor) VALUES
('Java Full Stack', 'Spring Boot + MySQL', 40, 'John Doe'),
('Frontend Development', 'HTML CSS JavaScript', 30, 'Jane Smith'),
('Python Programming', 'Python Basics to Advanced', 35, 'Bob Johnson');

INSERT INTO users (email, password, name) VALUES
('user@example.com', 'password', 'Test User');
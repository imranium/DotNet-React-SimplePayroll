DROP DATABASE IF EXISTS simple_payroll;
CREATE DATABASE simple_payroll;
USE simple_payroll;

-- 1. Employees Table
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    national_id VARCHAR(20) NOT NULL,
    contact_number VARCHAR(20),
    residence_address TEXT,
    date_of_birth DATE NOT NULL,
    daily_rate DECIMAL(18, 2) NOT NULL,
    working_days VARCHAR(100) NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Skillsets Table
CREATE TABLE skillsets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 3. Pivot Table
CREATE TABLE employee_skillsets (
    employee_id INT NOT NULL,
    skillset_id INT NOT NULL,
    PRIMARY KEY (employee_id, skillset_id),
    CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT fk_skillset FOREIGN KEY (skillset_id) REFERENCES skillsets(id) ON DELETE CASCADE
);


--- SAMPLE DATA SEEDING ---
-- Seed Skillsets
INSERT INTO skillsets (name) VALUES 
('C#'), ('.NET Core'), ('ReactJS'), ('Dapper'), ('MySQL');

-- Seed Employees
INSERT INTO employees (employee_number, full_name, national_id, contact_number, residence_address, date_of_birth, daily_rate, working_days) 
VALUES 
('RAZ-12340-10JAN1994', 'Razak bin Osman', '940110-01-5555', '012-3456789', 'Kuala Lumpur', '1994-01-10', 150.00, 'Tue,Wed,Fri'),
('CHE-00779-10SEP1994', 'Cheng Long', '940910-10-8888', '017-9876543', 'Ipoh, Perak', '1994-09-10', 100.00, 'Tue,Thu,Sat'),
('KUM-99999-14OCT2001', 'Kumar a/l Suppiah', '011014-08-1111', '011-11112222', 'Segamat, Johor', '2001-10-14', 200.00, 'Mon,Tue,Wed,Thu,Fri');

-- Seed Pivot Table 
INSERT INTO employee_skillsets (employee_id, skillset_id) VALUES 
(1, 2), (1, 4), -- Razak: .NET, Dapper
(2, 3),         -- Cheng Long: ReactJS
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5); -- Kumar: All
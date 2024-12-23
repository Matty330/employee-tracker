-- Insert departments
INSERT INTO department (name) VALUES
('Engineering'),
('Finance'),
('Human Resources'),
('Sales');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 120000, 1),
('Accountant', 75000, 2),
('HR Specialist', 60000, 3),
('Sales Representative', 50000, 4);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Alice', 'Johnson', 1, NULL),
('Bob', 'Smith', 2, NULL),
('Charlie', 'Brown', 3, 1),
('Diana', 'Prince', 4, 2);

const inquirer = require('inquirer');
const pool = require('./connection');

function mainMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Delete a department',
                    'Delete a role',
                    'Delete an employee',
                    'Exit',
                ],
            },
        ])
        .then((answer) => {
            switch (answer.action) {
                case 'View all departments':
                    viewDepartments();
                    break;
                case 'View all roles':
                    viewRoles();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Delete a department':
                    deleteDepartment();
                    break;
                case 'Delete a role':
                    deleteRole();
                    break;
                case 'Delete an employee':
                    deleteEmployee();
                    break;
                case 'Exit':
                    console.log('Goodbye!');
                    pool.end();
                    break;
            }
        });
}

// View all departments
function viewDepartments() {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.table(res.rows);
        }
        mainMenu();
    });
}

// View all roles
function viewRoles() {
    pool.query(
        `SELECT role.id, role.title, role.salary, department.name AS department
         FROM role
         JOIN department ON role.department_id = department.id`,
        (err, res) => {
            if (err) {
                console.error(err);
            } else {
                console.table(res.rows);
            }
            mainMenu();
        }
    );
}

// View all employees
function viewEmployees() {
    pool.query(
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary,
                CASE WHEN employee.manager_id IS NULL THEN 'None'
                     ELSE CONCAT(manager.first_name, ' ', manager.last_name)
                END AS manager
         FROM employee
         JOIN role ON employee.role_id = role.id
         JOIN department ON role.department_id = department.id
         LEFT JOIN employee AS manager ON employee.manager_id = manager.id`,
        (err, res) => {
            if (err) {
                console.error(err);
            } else {
                console.table(res.rows);
            }
            mainMenu();
        }
    );
}

// Add a department
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'Enter the name of the new department:',
            },
        ])
        .then((answer) => {
            const query = 'INSERT INTO department (name) VALUES ($1)';
            pool.query(query, [answer.departmentName], (err, res) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Added department: ${answer.departmentName}`);
                }
                mainMenu();
            });
        });
}

// Add a role
function addRole() {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.error(err);
            mainMenu();
            return;
        }

        const departments = res.rows.map((department) => ({
            name: department.name,
            value: department.id,
        }));

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'roleTitle',
                    message: 'Enter the title of the new role:',
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: 'Enter the salary for the new role:',
                },
                {
                    type: 'list',
                    name: 'departmentId',
                    message: 'Select the department for the new role:',
                    choices: departments,
                },
            ])
            .then((answers) => {
                const sanitizedSalary = parseFloat(answers.roleSalary.replace(/,/g, ''));

                if (isNaN(sanitizedSalary)) {
                    console.error('Invalid salary input. Please enter a valid number.');
                    mainMenu();
                    return;
                }

                const query =
                    'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
                pool.query(
                    query,
                    [answers.roleTitle, sanitizedSalary, answers.departmentId],
                    (err) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(`Added role: ${answers.roleTitle}`);
                        }
                        mainMenu();
                    }
                );
            });
    });
}

// Add an employee
function addEmployee() {
    pool.query('SELECT * FROM role', (err, res) => {
        if (err) {
            console.error(err);
            mainMenu();
            return;
        }

        const roles = res.rows.map((role) => ({
            name: role.title,
            value: role.id,
        }));

        pool.query('SELECT * FROM employee', (err, res) => {
            if (err) {
                console.error(err);
                mainMenu();
                return;
            }

            const managers = res.rows.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }));
            managers.unshift({ name: 'None', value: null });

            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: "Enter the employee's first name:",
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: "Enter the employee's last name:",
                    },
                    {
                        type: 'list',
                        name: 'roleId',
                        message: "Select the employee's role:",
                        choices: roles,
                    },
                    {
                        type: 'list',
                        name: 'managerId',
                        message: "Select the employee's manager:",
                        choices: managers,
                    },
                ])
                .then((answers) => {
                    const query =
                        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
                    pool.query(
                        query,
                        [
                            answers.firstName,
                            answers.lastName,
                            answers.roleId,
                            answers.managerId,
                        ],
                        (err) => {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log(
                                    `Added employee: ${answers.firstName} ${answers.lastName}`
                                );
                            }
                            mainMenu();
                        }
                    );
                });
        });
    });
}

// Update an employee's role
function updateEmployeeRole() {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) {
            console.error(err);
            mainMenu();
            return;
        }

        const employees = res.rows.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));

        pool.query('SELECT * FROM role', (err, res) => {
            if (err) {
                console.error(err);
                mainMenu();
                return;
            }

            const roles = res.rows.map((role) => ({
                name: role.title,
                value: role.id,
            }));

            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employeeId',
                        message: "Select the employee whose role you'd like to update:",
                        choices: employees,
                    },
                    {
                        type: 'list',
                        name: 'roleId',
                        message: "Select the employee's new role:",
                        choices: roles,
                    },
                ])
                .then((answers) => {
                    const query = 'UPDATE employee SET role_id = $1 WHERE id = $2';
                    pool.query(query, [answers.roleId, answers.employeeId], (err) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log(`Updated employee's role successfully!`);
                        }
                        mainMenu();
                    });
                });
        });
    });
}

// Delete a role
function deleteRole() {
    pool.query('SELECT * FROM role', (err, res) => {
        if (err) {
            console.error(err);
            mainMenu();
            return;
        }

        const roles = res.rows.map((role) => ({
            name: role.title,
            value: role.id,
        }));

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'Select the role to delete:',
                    choices: roles,
                },
            ])
            .then((answer) => {
                const query = 'DELETE FROM role WHERE id = $1';
                pool.query(query, [answer.roleId], (err) => {
                    if (err) {
                        console.error('Error deleting role:', err);
                    } else {
                        console.log('Role deleted successfully!');
                    }
                    mainMenu();
                });
            });
    });
}

// Delete an employee
function deleteEmployee() {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) {
            console.error(err);
            mainMenu();
            return;
        }

        const employees = res.rows.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: 'Select the employee to delete:',
                    choices: employees,
                },
            ])
            .then((answer) => {
                const query = 'DELETE FROM employee WHERE id = $1';
                pool.query(query, [answer.employeeId], (err) => {
                    if (err) {
                        console.error('Error deleting employee:', err);
                    } else {
                        console.log('Employee deleted successfully!');
                    }
                    mainMenu();
                });
            });
    });
}

// Delete a department
function deleteDepartment() {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) {
            console.error(err);
            mainMenu();
            return;
        }

        const departments = res.rows.map((department) => ({
            name: department.name,
            value: department.id,
        }));

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'departmentId',
                    message: 'Select the department to delete:',
                    choices: departments,
                },
            ])
            .then((answer) => {
                const query = 'DELETE FROM department WHERE id = $1';
                pool.query(query, [answer.departmentId], (err) => {
                    if (err) {
                        console.error('Error deleting department:', err);
                    } else {
                        console.log('Department deleted successfully!');
                    }
                    mainMenu();
                });
            });
    });
}

// Initialize the application
mainMenu();

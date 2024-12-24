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

// Other functions (viewDepartments, viewRoles, etc.) remain unchanged

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

// Initialize the application
mainMenu();

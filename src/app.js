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
                    'Delete a role', // New option
                    'Delete an employee', // New option
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

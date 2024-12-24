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
                case 'Exit':
                    console.log('Goodbye!');
                    pool.end();
                    break;
            }
        });
}

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

// Placeholder functions for other actions
function viewRoles() {
    console.log('View all roles selected.');
    mainMenu();
}

function viewEmployees() {
    console.log('View all employees selected.');
    mainMenu();
}

function addDepartment() {
    console.log('Add a department selected.');
    mainMenu();
}

function addRole() {
    console.log('Add a role selected.');
    mainMenu();
}

function addEmployee() {
    console.log('Add an employee selected.');
    mainMenu();
}

function updateEmployeeRole() {
    console.log('Update an employee role selected.');
    mainMenu();
}

mainMenu();

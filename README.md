# employee-tracker
A CLI-based application for managing a company's employee database.


# Employee Tracker

## Description
Command-line application for managing employee databases, built with Node.js and PostgreSQL. Enables business owners to track and modify departments, roles, and employee information through an intuitive interface.

## Installation

1. Clone the repository:
```bash
git clone <https://github.com/Matty330/employee-tracker.git>
cd employee-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up PostgreSQL database:
```sql
CREATE DATABASE employee_tracker;
```

4. Initialize database schema and seed data:
```bash
psql -d employee_tracker -f db/schema.sql
psql -d employee_tracker -f db/seeds.sql
```

5. Configure environment variables in `.env`:
```
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=employee_tracker
DB_PORT=5432
```

6. Start application:
```bash
npm start
```

## Usage
Select from the following options:
- View departments, roles, or employees
- Add department, role, or employee
- Update employee role
- Delete department, role, or employee

Follow the interactive prompts to manage your database.

## Features
- View, add, update, and delete database entries
- User-friendly command-line interface
- Formatted data display
- Secure database connection

## Technologies
- Node.js
- PostgreSQL
- Inquirer
- pg (Node PostgreSQL client)

## License
MIT
const pool = require('./connection');

pool.query('SELECT * FROM department', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    } else {
        console.log('Departments:', res.rows);
    }
    pool.end(); // Close the connection
});

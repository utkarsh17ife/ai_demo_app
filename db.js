const { Pool } = require('pg');

// Configured to match your pre-existing Docker Compose environment
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'ai_demo_app',
    password: 'admin',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
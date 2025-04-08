const { Pool } = require('pg');
const {queries} = require("./QueryManager");
require('dotenv').config();

class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;  // Return the existing instance if already created
        }

        this.pool = new Pool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });

        // Ensure the pool only creates one instance
        Database.instance = this;

        // Optional: Event listeners for debugging
        this.pool.on('connect', () => {
            console.log("Connected to the database!");
        });

        this.pool.on('error', (err) => {
            console.error("Error with the database connection pool:", err);
        });
    }

    async executeQuery(queryName, params = []) {
        const query = queries[queryName];
        if (!query) {
            console.log(`Query not found: ${queryName}`);
            throw new Error(`Query "${queryName}" not found.`);
        }

        try {
            const result = await this.pool.query(query, params);
            return result.rows;
        } catch (error) {
            console.error(`Error executing query "${queryName}":`, error);
            throw error;
        }
    }
    async executeCustomQuery(query, params = []) {
        if (!query) {
            console.log(`Query not found: ${queryName}`);
            throw new Error(`Query "${queryName}" not found.`);
        }

        try {
            const result = await this.pool.query(query, params);
            return result.rows;
        } catch (error) {
            console.error(`Error executing query "${queryName}":`, error);
            throw error;
        }
    }
}

// Create and export the singleton instance of Database
module.exports = new Database();

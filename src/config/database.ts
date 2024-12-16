import { DataSource } from "typeorm";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST, // Amazon RDS endpoint
    port: Number(process.env.DB_PORT) || 5432, // Default PostgreSQL port
    username: process.env.DB_USER, // RDS admin username
    password: process.env.DB_PASSWORD, // RDS admin password
    database: process.env.DB_NAME, // Your database name
    entities: [/* list your entity classes */], // Example: [User, Expense]
    synchronize: true, // Turn off in production; only for development
    ssl: {
        rejectUnauthorized: false, // For development purposes; adjust for production
    },
});

// Initialize the connection
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });

import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cors from "cors";
import { AppDataSource } from "./config/database";
import userRoutes from "./routes/UserRouters";
import expenseRoutes from "./routes/ExpenseRouters";
import "reflect-metadata";

// Load environment variables
config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);

// Initialize the database and start the server
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected");
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

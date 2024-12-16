import * as express from "express";
import {
    addExpense,
    getExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
} from "../services/ExpenseService";

// Create a new router
const router = express.Router();

// Define types for request bodies and query parameters
interface AddExpenseRequestBody {
    userId: number;
    amount: number;
    category: string;
    date: string; // Can be converted to a Date object
}

interface UpdateExpenseRequestBody {
    userId: number;
    amount: number;
    category: string;
    date: string; // Can be converted to a Date object
}

interface GetExpensesQuery {
    userId: string; // Received as string, will be converted to number
}

interface Params {
    expenseId: string; // Expense ID comes from the URL parameter
}

// Create a new expense
router.post("/", async (req: express.Request<{}, {}, AddExpenseRequestBody>, res: express.Response) => {
    try {
        const { userId, amount, category, date } = req.body;
        const result = await addExpense(userId, amount, category, new Date(date));
        res.status(201).json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

// Get all expenses for a user
router.get("/", async (req: express.Request<{}, {}, {}, GetExpensesQuery>, res: express.Response) => {
    try {
        const { userId } = req.query;
        const result = await getExpenses(Number(userId));
        res.status(200).json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

// Get a single expense by ID
router.get("/:expenseId", async (req: express.Request<Params, {}, {}, GetExpensesQuery>, res: express.Response) => {
    try {
        const { expenseId } = req.params;
        const { userId } = req.query;
        const result = await getExpenseById(Number(expenseId), Number(userId));
        res.status(200).json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

// Update an expense
router.put("/:expenseId", async (req: express.Request<Params, {}, UpdateExpenseRequestBody>, res: express.Response) => {
    try {
        const { expenseId } = req.params;
        const { userId, amount, category, date } = req.body;
        const result = await updateExpense(
            Number(expenseId),
            Number(userId),
            amount,
            category,
            new Date(date)
        );
        res.status(200).json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

// Delete an expense
router.delete("/:expenseId", async (req: express.Request<Params, {}, {}, GetExpensesQuery>, res: express.Response) => {
    try {
        const { expenseId } = req.params;
        const { userId } = req.query;
        await deleteExpense(Number(expenseId), Number(userId));
        res.status(204).send();
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

export default router;

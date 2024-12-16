import * as express from "express";
import {
    createSavingsGoal,
    updateSavingsGoal,
    getSavingsGoals,
    getSavingsGoalById,
    deleteSavingsGoal
} from "../services/SavingGoalService";

// Create a new router
const router = express.Router();

// Define types for request bodies and query parameters
interface CreateSavingsGoalRequestBody {
    userId: number;
    targetAmount: number;
    targetDate: string; // Can be converted to a Date object
}

interface UpdateSavingsGoalRequestBody {
    userId: number;
    amount: number;
}

interface GetSavingsGoalsQuery {
    userId: string; // Received as string, will be converted to number
}

interface GetSavingsGoalByIdQuery {
    userId: string; // Received as string, will be converted to number
}

interface Params {
    goalId: string; // Goal ID comes from the URL parameter
}

// Create a new savings goal
router.post("/", async (req: express.Request<{}, {}, CreateSavingsGoalRequestBody>, res: express.Response) => {
    try {
        const { userId, targetAmount, targetDate } = req.body;
        const result = await createSavingsGoal(userId, targetAmount, new Date(targetDate));
        res.status(201).json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

// Update an existing savings goal (e.g., increment the current amount)
router.patch("/:goalId", async (req: express.Request<Params, {}, UpdateSavingsGoalRequestBody>, res: express.Response) => {
    try {
        const { userId, amount } = req.body;
        const { goalId } = req.params;
        const result = await updateSavingsGoal(Number(userId), Number(goalId), amount);
        res.status(200).json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

// Get all savings goals for a user
router.get("/", async (req: express.Request<{}, {}, {}, GetSavingsGoalsQuery>, res: express.Response) => {
    try {
        const { userId } = req.query;
        const result = await getSavingsGoals(Number(userId));
        res.status(200).json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

// Get a specific savings goal by its ID
router.get("/:goalId", async (req: express.Request<Params, {}, {}, GetSavingsGoalByIdQuery>, res: express.Response) => {
    try {
        const { goalId } = req.params;
        const { userId } = req.query;
        const result = await getSavingsGoalById(Number(userId), Number(goalId));
        res.status(200).json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

// Delete a savings goal by its ID
router.delete("/:goalId", async (req: express.Request<Params, {}, {}, GetSavingsGoalByIdQuery>, res: express.Response) => {
    try {
        const { goalId } = req.params;
        const { userId } = req.query;
        await deleteSavingsGoal(Number(userId), Number(goalId));
        res.status(204).send(); // No content, as goal is deleted
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

export default router;

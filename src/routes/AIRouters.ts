import express from "express";
import { getFinancialAdvice } from "../services/ElizaService";

// Define the request body type
interface ChatRequestBody {
    message: string;
}

const router = express.Router();

// Asynchronous route handler for financial advice
router.post("/chat", async (req: express.Request<{}, {}, ChatRequestBody>, res: express.Response) => {
    const { message } = req.body;

    try {
        // Await the response if getFinancialAdvice is asynchronous
        const response = await getFinancialAdvice(message);

        // Send the response as JSON
        res.status(200).json({ reply: response });
    } catch (error: unknown) {
        // Error handling for unknown errors
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    }
});

export default router;

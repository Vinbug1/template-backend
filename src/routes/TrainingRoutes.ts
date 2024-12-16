import express, { Request, Response } from 'express';
import { elizaTrainer } from '../services/ElizaTrainingService';
import { addFinancialTrainingData } from '../services/ElizaService';

const router = express.Router();

// Define request body type for training endpoint
interface TrainingRequestBody {
    patterns: string[];

    userId: string;
}

router.post('/train', async (req: Request, res: Response) => {
    try {
        const { patterns, responses, userId } = req.body;

        // Validate the incoming data
        if (!Array.isArray(patterns) || !Array.isArray(responses)) {
            return res.status(400).json({ error: 'Patterns and responses must be arrays.' });
        }

        if (patterns.length === 0 || responses.length === 0) {
            return res.status(400).json({ error: 'Patterns and responses cannot be empty.' });
        }

        if (patterns.length !== responses.length) {
            return res.status(400).json({ error: 'Patterns and responses arrays must have the same length.' });
        }

        // Handle the training logic and add new patterns
        const notifications: string[] = [];
        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            const addedPattern = await elizaTrainer.addPatternIfNotExists(pattern); // Assuming async

            if (addedPattern) {
                notifications.push(`New pattern "${addedPattern}" added! Please add a response to help train the AI.`);
            }
        }

        // If there are notifications, store them for the user
        if (notifications.length > 0) {
            storeNotificationForUser(userId, notifications.join(' '));
            return res.status(200).json({
                message: 'Patterns added successfully. Please provide a response to train the AI.',
            });
        }

        // Save the training data after validation and pattern updates
        await addFinancialTrainingData(patterns, responses);

        return res.status(200).json({
            message: 'Training data added successfully!',
        });

    } catch (error: unknown) {
        // Ensure error is of type Error to access message
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unknown error occurred.' });
    }
});

// Helper function to store notifications (you may want to implement actual storage)
function storeNotificationForUser(userId: string, message: string) {
    console.log(`Notification for user ${userId}: ${message}`);
}

export default router;

import ElizaBot from 'elizabot';
import { elizaTrainer } from '../services/ElizaTrainingService';

const eliza = new ElizaBot();

// Define the function to get financial advice based on user input
export function getFinancialAdvice(userInput: string): string {
    // First, try custom trained responses
    const trainedResponse = elizaTrainer.matchResponse(userInput);

    // If no trained response, fall back to original ELIZA
    if (trainedResponse && trainedResponse !== "I'm not sure how to respond to that.") {
        return trainedResponse;
    }

    // Fallback to original ELIZA transformation
    return eliza.transform(userInput);
}

// Expose method to add more training data
export function addFinancialTrainingData(patterns: string[], responses: string[]) {
    if (patterns.length !== responses.length) {
        throw new Error('Patterns and responses arrays must have the same length.');
    }
    
    elizaTrainer.addTrainingData({ patterns, responses });
}

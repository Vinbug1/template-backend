import { SavingsGoal } from "../models/SavingsGoal";
import { AppDataSource } from "../config/database";

const savingsGoalRepository = AppDataSource.getRepository(SavingsGoal);

// Create a new savings goal
export async function createSavingsGoal(userId: number, targetAmount: number, targetDate: Date) {
    const goal = savingsGoalRepository.create({ user: { id: userId }, targetAmount, currentAmount: 0, targetDate });
    return await savingsGoalRepository.save(goal);
}

// Update an existing savings goal (increment the current amount)
export async function updateSavingsGoal(userId: number, goalId: number, amount: number) {
    const goal = await savingsGoalRepository.findOneBy({ id: goalId, user: { id: userId } });
    if (!goal) throw new Error("Goal not found");

    goal.currentAmount += amount;
    return await savingsGoalRepository.save(goal);
}

// Get all savings goals for a user
export async function getSavingsGoals(userId: number) {
    return await savingsGoalRepository.findBy({ user: { id: userId } });
}

// Get a specific savings goal by its ID
export async function getSavingsGoalById(userId: number, goalId: number) {
    const goal = await savingsGoalRepository.findOneBy({ id: goalId, user: { id: userId } });
    if (!goal) throw new Error("Goal not found");
    return goal;
}

// Delete a specific savings goal by its ID
export async function deleteSavingsGoal(userId: number, goalId: number) {
    const goal = await savingsGoalRepository.findOneBy({ id: goalId, user: { id: userId } });
    if (!goal) throw new Error("Goal not found");

    await savingsGoalRepository.remove(goal);
}

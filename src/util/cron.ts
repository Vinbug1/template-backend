import cron from "node-cron";
import { AppDataSource } from "../config/database";
import { SavingsGoal } from "../models/SavingsGoal";
import { sendNotification } from "../services/NotificationService";

cron.schedule("0 9 * * *", async () => {
    const savingsGoalRepository = AppDataSource.getRepository(SavingsGoal);
    const goals = await savingsGoalRepository.find({ relations: ["user"] });

    goals.forEach(async (goal) => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        if (progress >= 75 && progress < 100) {
            await sendNotification(goal.user.email, "Savings Goal Update", "You have reached 75% of your goal!");
        } else if (progress >= 100) {
            await sendNotification(goal.user.email, "Savings Goal Achieved", "Congratulations on achieving your savings goal!");
        }
    });
});

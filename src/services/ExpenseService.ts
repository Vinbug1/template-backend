import { Expense } from "../models/Expense";
import { AppDataSource } from "../config/database";

const expenseRepository = AppDataSource.getRepository(Expense);

// Create a new expense
export async function addExpense(userId: number, amount: number, category: string, date: Date) {
    const expense = expenseRepository.create({ user: { id: userId }, amount, category, date });
    return await expenseRepository.save(expense);
}

// Get all expenses for a user
export async function getExpenses(userId: number) {
    return await expenseRepository.find({
        where: { user: { id: userId } },
        relations: ["user"],  // Ensure you load the related user information if needed
    });
}

// Get a single expense by ID
export async function getExpenseById(expenseId: number, userId: number) {
    const expense = await expenseRepository.findOne({
        where: { id: expenseId, user: { id: userId } },
        relations: ["user"],  // Include relations if needed
    });

    if (!expense) {
        throw new Error("Expense not found");
    }

    return expense;
}

// Update an existing expense
export async function updateExpense(expenseId: number, userId: number, amount: number, category: string, date: Date) {
    const expense = await expenseRepository.findOne({
        where: { id: expenseId, user: { id: userId } },
        relations: ["user"],
    });

    if (!expense) {
        throw new Error("Expense not found");
    }

    // Update the expense fields
    expense.amount = amount;
    expense.category = category;
    expense.date = date;

    return await expenseRepository.save(expense);
}

// Delete an expense by ID
export async function deleteExpense(expenseId: number, userId: number) {
    const expense = await expenseRepository.findOne({
        where: { id: expenseId, user: { id: userId } },
        relations: ["user"],
    });

    if (!expense) {
        throw new Error("Expense not found");
    }

    return await expenseRepository.remove(expense);
}

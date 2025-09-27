import Expense from '../models/expense.js';

const expenseControllers = {
    // Get all expenses
    getAllExpenses: async (req, res) => {
    try {
        const userExpenses = await Expense.find({ userId: req.user._id });
        res.status(200).json(userExpenses);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
    },

    // Get a single expense by its _id
    getExpenseById: async (req, res) => {
        const { id } = req.params;
        try {
            const expense = await Expense.findOne({ _id: id });
            if (expense) {
                res.status(200).json(expense);
            } else {
                res.status(404).json({ message: 'Expense not found' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    // Get all expenses of a specific user
    getUserExpenses: async (req, res) => {
    const { id } = req.params;
    try {
        const userExpenses = await Expense.find({ userId: id });
        res.status(200).json(userExpenses || []);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
    },

    // Get expenses by category
    getExpensesByCategory: async (req, res) => {
        const { category } = req.params;
        try {
            const expenses = await Expense.find({ category });
            if (!expenses || expenses.length === 0) {
                return res.status(404).json({ message: "No expenses found for this category" });
            }
            res.status(200).json(expenses);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Server Error" });
        }
    },

    // Create a new expense
    createExpense: async (req, res) => {
        const { amount, category, description, date, userId } = req.body;
        try {
            if (amount && category && userId) {
                const newExpense = new Expense({
                    amount,
                    category,
                    userId,
                    ...(description && { description }),
                    ...(date && { date })
                });
                await newExpense.save();
                res.status(201).json(newExpense);
            } else {
                res.status(400).json({ message: 'Amount, category and userId are required' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    },

    // Update existing expense
    updateExpense: async (req, res) => {
        const { id } = req.params;
        const { amount, category, description, date } = req.body;
        try {
            if (amount && category) { // الوصف والـ date اختياريين
                const updateData = { amount, category };
                if (description) updateData.description = description;
                if (date) updateData.date = date;

                const updatedExpense = await Expense.updateOne(
                    { _id: id },
                    updateData
                );

                if (updatedExpense.modifiedCount > 0) {
                    res.status(200).json({ message: 'Expense updated successfully' });
                } else {
                    res.status(404).json({ message: 'Expense not found' });
                }
            } else {
                res.status(400).json({ message: "Amount and category are required" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    },

    // Delete an expense by its _id
    deleteExpense: async (req, res) => {
        const { id } = req.params;
        try {
            const deletedExpense = await Expense.deleteOne({ _id: id });
            if (deletedExpense.deletedCount > 0) {
                res.status(200).json({ message: 'Expense deleted successfully' });
            } else {
                res.status(404).json({ message: 'Expense not found' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Server Error' });
        }
    }
};

export default expenseControllers;

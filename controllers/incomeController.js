import Income from '../models/income.js';

const incomeControllers = {
    // ✅ Get all income records
    // GET http://localhost:5002/income/
    getAllIncome: async (req, res) => {
        try {
            // عرض فقط دخل المستخدم الحالي
            const userIncome = await Income.find({ userId: req.user._id });
            res.status(200).json(userIncome);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },
    // ✅ Get a single income by its _id
    // GET http://localhost:5002/income/:id
    getIncomeById: async (req, res) => {
        const { id } = req.params;
        try {
            const income = await Income.findById(id);
            if (!income) {
                return res.status(404).json({ message: 'Income not found' });
            }
            res.status(200).json(income);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    // ✅ Get all income records for a specific user
    // GET http://localhost:5002/income/user/:id
    getUserIncome: async (req, res) => {
        const { id } = req.params; // userId
        try {
            if (req.user._id !== id) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const userIncome = await Income.find({ userId: id });
            res.status(200).json(userIncome || []);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },
    // ✅ Get income by source
    // GET http://localhost:5002/income/source/:source
    getIncomeBySource: async (req, res) => {
        const { source } = req.params;
        try {
            const income = await Income.find({ source });
            if (!income || income.length === 0) {
                return res.status(404).json({ message: 'No income found for this source' });
            }
            res.status(200).json(income);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    // ✅ Create a new income record
    // POST http://localhost:5002/income
    createIncome: async (req, res) => {
        const { amount, source, date, description, userId } = req.body;
        try {
            if (amount && source && userId) {
                const newIncome = new Income({
                    amount,
                    source,
                    userId,
                    ...(description && { description }),
                    ...(date && { date })
                });

                await newIncome.save();
                res.status(201).json(newIncome);
            } else {
                res.status(400).json({ message: 'Amount, source and userId are required' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    },

    // ✅ Update existing income
    // PUT http://localhost:5002/income/:id
    updateIncome: async (req, res) => {
    const { id } = req.params;
    const { amount, source, date, description } = req.body;
    try {
        if (amount && source) { 
            const updateData = { amount, source };
            if (date) updateData.date = date;
            if (description) updateData.description = description;

            const updatedIncome = await Income.updateOne({ _id: id }, updateData);

            if (updatedIncome.modifiedCount > 0) {
                res.status(200).json({ message: 'Income updated successfully' });
            } else {
                res.status(404).json({ message: 'Income not found' });
            }
        } else {
            res.status(400).json({ message: 'Amount and source are required' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
    },

    // ✅ Delete an income record by _id
    // DELETE http://localhost:5002/income/:id
    deleteIncome: async (req, res) => {
        const { id } = req.params;
        try {
            const deletedIncome = await Income.deleteOne({ _id: id });
            if (deletedIncome.deletedCount > 0) {
                res.status(200).json({ message: 'Income deleted successfully' });
            } else {
                res.status(404).json({ message: 'Income not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server Error' });
        }
    }
};

export default incomeControllers;



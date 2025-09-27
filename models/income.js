import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true,

        },
        source: {
            type: String,
            required: true
        },

        description: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        },
    
    { timestamps: true }
);

const Income = mongoose.model('Income', incomeSchema);
export default Income;
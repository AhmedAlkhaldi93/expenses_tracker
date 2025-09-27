import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Construct path
const __filename = fileURLToPath(import.meta.url);
const PATH = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(PATH, '..', '.env') });

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB successfully');
    } catch (err) {
        console.error('❌ Failed to connect to MongoDB');
        console.error(err);
    }
};

export default connectToDB;

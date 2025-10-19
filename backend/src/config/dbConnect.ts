import mongoose from 'mongoose';
import { getDatabaseUri } from '../config/dbConfig'; // ✅ Import the utility

// Note: You should ensure your .env files are loaded before this function runs (e.g., in app.ts)

export const connectDatabase = () => {
    try {
        // 💡 Use the extracted function to get the URI
        const DB_URI = getDatabaseUri();

        mongoose.connect(DB_URI).then(con => {
            console.log(`✅ Mongo Database connected with HOST: ${con?.connection?.host} in ${process.env.NODE_ENV} mode.`);
        });
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        // Optional: Exit the process if connection is critical
        // process.exit(1); 
    }
}
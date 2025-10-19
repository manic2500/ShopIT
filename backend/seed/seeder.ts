import mongoose from 'mongoose';

import { configDotenv } from "dotenv";
import { categoriesData } from './category.data';
import { productsData } from './product.data';
import { getDatabaseUri } from "../src/config/dbConfig";

import Category from "../src/models/category";
import Product from "../src/models/product";

// 🚀 Seeding function
const seedCategories = async () => {
    // Load environment variables for the database URI
    configDotenv({ path: 'backend/config/.env' })

    try {
        // 1. Use the extracted function to get the URI
        const DB_URI = getDatabaseUri();

        await mongoose.connect(DB_URI);
        console.log('✅ MongoDB Connected for Seeding.');

        // 2. Check and Insert Data (Idempotent check)

        // Convert category names to an array for a single query
        const names = categoriesData.map(c => c.name);

        // Find existing categories to avoid duplicates
        const existingCategories = await Category.find({ name: { $in: names } });

        const categoriesToInsert = categoriesData.filter(category => {
            // Only keep categories that DON'T already exist in the database
            return !existingCategories.some(existing => existing.name === category.name);
        });

        if (categoriesToInsert.length > 0) {
            await Category.insertMany(categoriesToInsert);
            console.log(`✨ Successfully seeded ${categoriesToInsert.length} new categories.`);
        } else {
            console.log('ℹ️ All categories already exist. Skipping insertion.');
        }

        // --- 2. Product Seeding ---

        // Clear products to avoid ID conflicts (recommended when using fixed IDs)
        await Product.deleteMany({});
        console.log('🗑️ Existing products cleared.');

        await Product.insertMany(productsData);
        console.log(`📦 Successfully seeded ${productsData.length} products.`);


    } catch (error) {
        console.error('❌ Error during seeding process:', error);
        process.exit(1); // Exit with failure code
    } finally {
        // 3. Disconnect from the database and exit
        await mongoose.disconnect();
        console.log('👋 MongoDB Disconnected. Seeder finished.');
        process.exit(0); // Exit with success code
    }
};

// Execute the function
seedCategories();
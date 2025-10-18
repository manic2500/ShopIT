import { configDotenv } from "dotenv";
import express from "express"
import productRoutes from "./routes/products";
import { connectDatabase } from "./config/dbConnect";

const app = express()

configDotenv({ path: 'backend/src/config/.env' })

// Connect to DB
connectDatabase()

// Routes
app.use('/api/v1', productRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})
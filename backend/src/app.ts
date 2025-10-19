import { configDotenv } from "dotenv";
import express from "express"
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/category";
import authRoutes from "./routes/auth";
import { connectDatabase } from "./config/dbConnect";
import errorHandler from "./middlewares/errors";
import qs from "qs";

const app = express()

process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err}`);
    console.log('Shutting down server due to uncaught exception');
    process.exit(1)
})

configDotenv({ path: 'backend/config/.env' })

// Connect to DB
connectDatabase()

app.set('query parser', (str: string) => qs.parse(str))
//app.use(express.urlencoded({ extended: true }));// The crucial part: Tell Express to use simple parsing (no nested objects)
app.use(express.json())


// Routes
app.use('/api/v1', [productRoutes, categoryRoutes, authRoutes]);
/* app.use('/api/v1', categoryRoutes);
app.use('/api/v1', authRoutes); */

// global error handler
app.use(errorHandler);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})

// Handle Unhandled Promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`ERROR: ${err}`);
    console.log('Shutting down server due to unhandled promise rejection');
    server.close(() => {
        process.exit(1)
    })
})
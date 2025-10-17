import { configDotenv } from "dotenv";
import express from "express"
const app = express()


configDotenv({
    path: 'backend/config/.env'
})

app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})



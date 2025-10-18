import mongoose from "mongoose";

export const connectDatabase = () => {

    let DB_URI = ""

    if (process.env.NODE_ENV === 'DEV')
        DB_URI = process.env.DB_LOCAL_URI!
    else if (process.env.NODE_ENV === 'PROD')
        DB_URI = process.env.DB_URI!

    console.log(DB_URI);

    mongoose.connect(DB_URI).then(con => {
        console.log(`Mongo Database connected with HOST: ${con?.connection?.host}`);

    })
}
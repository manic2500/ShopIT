import mongoose from "mongoose";
import { IUser } from "./user";

// Interface for the Review Sub-document
export interface IReview {
    user: IUser['_id'], //Types.ObjectId
    rating: number,
    comment: string
}

// Schema for the Review Sub-document in Product Schema
export const ReviewSchema = new mongoose.Schema<IReview>(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    },
    {
        _id: false // Optional: Setting _id: false prevents Mongoose from adding a default _id to each image sub-document
    }
)
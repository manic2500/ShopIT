import mongoose, { Document } from "mongoose";
import { IImage, ImageSchema } from "./base";
import { IReview, ReviewSchema } from "./review";


export interface IProduct extends Document {
    name: string
    price: number
    description: string
    ratings: number,
    images?: IImage[],
    category: mongoose.Types.ObjectId, // Type the category field as an ObjectId from ICategory
    seller: string,
    stock: number,
    numOfReviews: number,
    reviews?: IReview[],
    user?: mongoose.Types.ObjectId //IUser['_id']
}

const ProductSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        maxLength: [200, 'Product name cannot exceed 200 characters'],
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [5, 'Product price cannot exceed 5 digits']
    },
    description: {
        type: String,
        required: [true, 'Please enter product description']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [ImageSchema],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please select product category']
    },
    seller: {
        type: String,
        required: [true, 'Please enter product seller'],
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [ReviewSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
}, {
    timestamps: true
})

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

/* 
category1: {
        type: String,
        required: [true, 'Please enter product category'],
        enum: {
            values: ['Laptops'],
            message: 'Please select correct category'
        }
    }

*/
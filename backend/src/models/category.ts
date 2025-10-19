import mongoose, { Document } from "mongoose";

// Interface to define the Category document structure
interface ICategory extends Document {
    name: string;
}

const CategorySchema = new mongoose.Schema<ICategory>({
    name: {
        type: String,
        required: [true, 'Please enter category name'],
        unique: true,
        trim: true
    }
}, {
    timestamps: true
})

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category
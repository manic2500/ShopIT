import mongoose from "mongoose";


// Interface for the Image Sub-document
export interface IImage {
    public_id: string;
    url: string;
}

// Schema for the Image Sub-document
export const ImageSchema = new mongoose.Schema<IImage>(
    {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    {
        _id: false // Optional: Setting _id: false prevents Mongoose from adding a default _id to each image sub-document
    }
); 
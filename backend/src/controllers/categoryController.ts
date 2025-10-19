import { RequestHandler } from "express";
import Category from "../models/category";


export const createCategory: RequestHandler = async (req, res) => {
    const category = await Category.create(req.body)

    res.status(201).json({ category })
}

export const getAllCategories: RequestHandler = async (req, res) => {

    try {
        const categories = await Category.find();

        if (categories.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No categories found"
            })
        }

        res.status(200).json({
            success: true,
            categories
        })
    } catch (error) {
        // Handle potential database errors (e.g., connection issues)
        res.status(500).json({
            success: false,
            message: "Server error while fetching categories",
            error: error
        });
    }


}



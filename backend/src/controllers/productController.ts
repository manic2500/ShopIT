import { RequestHandler } from "express"
import Product from "../models/product";
import { toProductDto } from "../dto/product.dto";
import Exception from "../utils/Exception";
import APIFilters from "../utils/APIFilters";

// Get All Products => /api/v1/products
export const getProducts: RequestHandler = async (req, res) => {
    const resPerPage = 3; // Define items per page
    const query = Product.find();

    // 1. Apply all the filters and pagination
    const apiFilters = new APIFilters(query, req.query)
        .search() // Handles /products?keyword=laptop
        .filter()   // Handles /products?price[gte]=1000&ratings[lt]=4.5
        .sort()     // Handles /products?sort=price
        .paginate(resPerPage); // Handles /products?page=2

    // 2. Execute BOTH queries simultaneously

    // A. Get the total count (uses the cloned query without limit/skip)
    const productsCount = await apiFilters.count();

    // B. Get the paginated products (uses the main query with limit/skip)
    const productData = await apiFilters.query.lean();

    // 3. Calculate total pages
    const totalPages = Math.ceil(productsCount / resPerPage);

    const products = productData.map(toProductDto);

    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        totalPages,
        data: products
    })
}


// Create Product => /api/v1/admin/products
export const createProduct: RequestHandler = async (req, res) => {
    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product: toProductDto(product)
    })
}


// Route to get a single product => /api/v1/products/:id
export const getSingleProduct: RequestHandler = async (req, res, next) => {
    const product = await Product.findById(req?.params?.id)
        .populate('category', 'name').lean(); // Key step: Populate the category field

    if (!product) {
        return next(new Exception('Product not found', 404))
    }

    res.status(200).json({
        success: true,
        product: toProductDto(product)
    });
};

// Route to get a single product => /api/v1/products/:id
export const updateProduct: RequestHandler = async (req, res) => {
    let product = await Product.findById(req?.params?.id)

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body,
        { new: true }
    )

    res.status(200).json({
        success: true,
        product: toProductDto(product)
    });
};
export const deleteProduct: RequestHandler = async (req, res) => {
    const product = await Product.findById(req?.params?.id)

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    await product.deleteOne()

    res.status(200).json({
        success: true,
        message: "Product Deleted"
    });
};


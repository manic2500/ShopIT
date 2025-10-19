import { Model, Query } from "mongoose";
import { IProduct } from "../models/product";

// Define a type for the Express req.query object
type ExpressQuery = { [key: string]: any };

class APIFilters {
    // Use a Mongoose Query type for better chaining and typing
    query: Query<IProduct[], IProduct>;
    // Use the defined type for the incoming query parameters
    queryParams: ExpressQuery;
    // 💡 New Property: A clean query to get the total count
    countQuery: Query<IProduct[], IProduct>;

    constructor(query: Query<IProduct[], IProduct>, queryParams: ExpressQuery) {
        this.query = query.populate('category', 'name');
        this.queryParams = queryParams;

        // Initialize countQuery to the base query
        this.countQuery = query.clone(); // Use .clone() immediately
    }

    // Search method using the queryParams
    search() {
        const keyword = this.queryParams.keyword ? {
            name: {
                $regex: this.queryParams.keyword,
                $options: 'i' // case-insensitive
            }
        } : {};

        // 1. Apply the filter to the main query
        // The .find() method merges new conditions into the existing query object
        this.query = this.query.find({ ...keyword });

        // 2. 💡 Update the countQuery by cloning the main query.
        // This ensures the count query has the search filter applied but no limit/skip.
        this.countQuery = this.query.clone();

        return this; // Return 'this' for chaining
    }

    // 1. Field Filtering (Comparison Operators)
    filter() {
        // Create a copy of the queryParams to prevent modification of the original req.query
        const queryObj = { ...this.queryParams };

        // 1a. Exclude special fields that are handled by other methods
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1b. Convert query operators (gt, gte, lt, lte) to MongoDB operators ($gt, $gte, etc.)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        // The Mongoose .find() method merges new conditions with existing ones
        this.query = this.query.find(JSON.parse(queryStr));

        // 💡 Update the countQuery to include the same filters
        // Mongoose queries are mutable, so we update the cloned query too
        this.countQuery = this.query.clone();

        return this;
    }

    // 2. Sorting
    sort() {
        if (this.queryParams.sort) {
            // Converts comma-separated string to space-separated string for Mongoose
            // e.g., ?sort=price,-ratings -> 'price -ratings'
            const sortBy = (this.queryParams.sort as string).split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            // Default sort: sort by creation date descending
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    // 3. Pagination
    paginate(resPerPage: number = 10) {
        // Ensure page is a number, defaulting to 1
        const currentPage = Number(this.queryParams.page) || 1;

        // Calculate the number of documents to skip
        const skip = resPerPage * (currentPage - 1);

        // 🛑 Apply limit/skip ONLY to the main 'this.query'
        this.query = this.query.limit(resPerPage).skip(skip);

        // 'this.countQuery' remains untouched by limit/skip
        return this;
    }

    // 💡 New Method: Executes the count query
    async count() {
        // Use the cloned query (which has all search/filter conditions)
        return await this.countQuery.countDocuments();
    }
}

export default APIFilters
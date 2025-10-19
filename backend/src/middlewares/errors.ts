import { ErrorRequestHandler } from "express";
import Exception from "../utils/Exception"; // Assuming this is your custom error class
import mongoose from "mongoose";

const errorHandler: ErrorRequestHandler = (err: any, req, res, next) => {
    // 1. Initialize a standardized error object for the response
    let statusCode = err?.statusCode || 500;
    let message = err?.message || 'Internal Server Error';

    // 2. Handle specific Mongoose errors

    // Handle Invalid Mongoose ID (CastError)
    if (err instanceof mongoose.Error.CastError) {
        message = `Resource not found. Invalid value for field: ${err.path}`;
        statusCode = 404;
    }

    // Handle Mongoose Validation Error
    else if (err instanceof mongoose.Error.ValidationError) {
        // Concatenate all validation messages from Mongoose's errors object
        message = Object.values(err.errors).map((value) => value.message).join(" | ");
        statusCode = 400; // Bad Request
    }

    // Handle Mongoose/MongoDB Duplicate Key Error (Code 11000)
    else if (err.code === 11000) {
        // Extract the field name from the raw MongoDB error message
        const field = Object.keys(err.keyValue).join(', ');
        message = `Duplicate field value: '${field}'. Please use another value.`;
        statusCode = 409; // Conflict
    }

    // Handle all other errors, including custom 'Exception' instances 
    // (If the error object has a message and a statusCode, use them)
    else if (err instanceof Exception) {
        message = err.message;
        statusCode = err.statusCode;
    }


    // 3. Final Response Logic
    if (process.env.NODE_ENV === 'DEV') {
        res.status(statusCode).json({
            status: 'error',
            statusCode: statusCode,
            message: message,
            // Only expose internal details in development
            error: err.name,
            stack: err.stack
        });
    } else {
        res.status(statusCode).json({
            status: 'error',
            statusCode: statusCode,
            message: message
        });
    }
}

export default errorHandler;




/* import { ErrorRequestHandler } from "express";
import Exception from "../utils/Exception";
import mongoose from "mongoose";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let error = new Exception(
        err?.message || 'Internal Server Error',
        err?.statusCode || 500
    )

    // Handle Invalid Mongoose ID (ObjectId) Error
    //if (err.name === 'CastError') {
    if (err instanceof mongoose.Error.CastError) {
        const message = `Resource not found. Invalid: ${err.path}`
        error = new Exception(message, 404)
    }

    // Handle Validation Error
    if (err instanceof mongoose.Error.ValidationError) {
        const message = Object.values(err.errors).map(value => value.message).join(",")
        error = new Exception(message, 400)
    }

    if (process.env.NODE_ENV === 'DEV') {
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err?.stack
        })
    }
    else {
        res.status(error.statusCode).json({
            message: error.message
        })
    }

}

export default errorHandler */
import { RequestHandler } from "express";
import User, { IUser } from "../models/user";
import Exception from "../utils/Exception";

// Register User - /api/v1/register
export const registerUser: RequestHandler = async (req, res, next) => {

    const { name, email, password } = req.body as IUser

    const user = await User.create({
        name, email, password
    })

    const token = user.getJwtToken()

    res.status(201).json({
        success: true,
        user: {
            id: user._id,
            name,
            email,
            token
        }
    })
}

// Login User - /api/v1/login
export const loginUser: RequestHandler = async (req, res, next) => {

    const { email, password } = req.body as IUser
    if (!email || !password) {
        return next(new Exception('Please enter email & password', 400))
    }

    // Find user
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return next(new Exception('Invalid email or password', 401))
    }

    // Check if password is correct
    const isPasswordMatched = await user.comparePassword(password)
    if (!isPasswordMatched) {
        return next(new Exception('Invalid email or password', 401))
    }

    const token = user.getJwtToken()

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email,
            token
        }
    })
}
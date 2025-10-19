import mongoose, { Document } from "mongoose";
import { IImage, ImageSchema } from "./base";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from 'jsonwebtoken';

export interface IUser extends Document {
    name: string
    email: string,
    password: string,
    avatar?: IImage,
    role: 'user' | 'admin',
    resetPasswordToken: string,
    resetPasswordExpire: Date,

    getJwtToken(): string
    comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [50, 'Your name cannot exceed 50 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your name'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [6, 'Your password must be longer than 6 characters'],
        select: false
    },
    avatar: [ImageSchema],
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
})

// Encrypt password before saving the user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// Return JWT Token
UserSchema.methods.getJwtToken = function (this: IUser) {
    // Ensure existence of variables (Best Practice)
    const secret = process.env.JWT_SECRET;
    const expiryTime = process.env.JWT_EXPIRES_TIME;

    if (!secret || !expiryTime) {
        throw new Error("Missing JWT_SECRET or JWT_EXPIRES_TIME environment variable.");
    }

    // 1. Define the target type by looking at the SignOptions
    // The key 'expiresIn' in SignOptions has the type you need.
    type ExpiresInType = NonNullable<SignOptions['expiresIn']>;

    // 2. Cast the environment variable to this specific type
    const expiresInValue = expiryTime as ExpiresInType;

    return jwt.sign({ id: this._id }, secret, {
        expiresIn: expiresInValue // No more TS error
    });

}

// Compare user password
UserSchema.methods.comparePassword = async function (
    this: IUser,
    enteredPassword: string
): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model<IUser>('User', UserSchema);

export default User
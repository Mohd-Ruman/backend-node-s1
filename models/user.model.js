import mongoose, { mongo, Types } from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "User name is required"],
            trim: true,
            minLenght: 2,
            maxLenght: 50,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'Please fill a valid email address']
        },
        password: {
            type: String,
            minLength: 6,
            required : [true, 'User password is required'],
        }
    }, 
    {
        timestamps: true
    });

const User = mongoose.model('User', userSchema)

export default User;
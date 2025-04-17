import mongoose from "mongoose"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

import User from '../models/user.model.js'
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";


export const signUp = async (req, res, next) => {
    // const session = await mongoose.startSession();

    // session.startTransaction(); 

    try {
        const { name, email, password } = req.body;

        //Check if user already exists
        const existingUser = await User.findOne( { email });

        if(existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //New user
        const newUsers = await User.create(
            [
                {
                    name,
                    email,
                    password: hashedPassword
                }
            ],
            // {
            //     session
            // }
        )

        //Generate token
        //  const token = jwt.sign(newUsers[0].toJSON(), JWT_SECRET, JWT_EXPIRES_IN);
        // => Was having {"success": false,"error": "Expected \"options\" to be a plain object."} 
         const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // await session.commitTransaction();
        // session.endSession();

        //Send success response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUsers[0],
            }
        })
        
    } catch (error) {
        // await session.abortTransaction();
        // session.endSession();
        next(error);
    }
    //For atomic updates, Operation : 
    //Database operations that update the statee are atomic.
    // All or nothing

    // Insert either works completely or it doesn't.
    // Update either works completely or it doesn't.
    // You never get half an operation. 

    // Reasons why operation may not work :
    //     One or more constraints violeted. 
    //     Datatype mismatch. 
    //     Syntax error. 
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne( { email });

        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
 
        if(!isPasswordValid){
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN});

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user
            }
        })

    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {}
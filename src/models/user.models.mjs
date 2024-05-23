import mongoose, { mongo } from "mongoose";
import passport from "passport";

const userSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    displayName: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    } 
});

export const UserSchema = mongoose.model("UserSchema", userSchema)
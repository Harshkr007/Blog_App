import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required:true,
    },
    DOB: {
        type:Date,
        required: true,
    },
    gender: {
        type : String,
        enum : ["Male","Female","Others"],
        required: true,
    },
    email: {
        type : String,
        required: true,
        unique: true,
    },
    password: {
        type : String,
        required: true,
    },
    avatar:{
        type: String,
        required: true,
        default: "https://res.cloudinary.com/harsh-090/image/upload/v1730218039/avatar_dif24m.jpg"
    },
    role: {
        type: String,
        enum: ["USER","ADMIN"],
        default : "USER",
    }
},{
    timestamps:true,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }

}); 

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.genrateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            avatar : this.avatar,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema);
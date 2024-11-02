import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { imageCrop } from "../utils/imageCrop.js";
import asyncHandler from "../utils/asyncHandler.js"

const authentication = asyncHandler(
    async (req, res, next) => {
        const Usertoken = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '') || '';
    
        if (!Usertoken || typeof Usertoken !== 'string') {
            return res.status(400).render("signIn", {
                type: "Invalid",
                message: "Invalid or missing authentication token"
            });
        }
    
        try {
            const decodedToken = await jwt.verify(Usertoken, process.env.ACCESS_TOKEN_SECRET);
            
            const user = await User.findById(decodedToken?._id).select("-password");
    
    
            if (!user) {
                return res.redirect(302, "/signin");
            }
            
            user.avatar = imageCrop({imageUrl : user.avatar, type :"Circle"});
            console.log(user);
            req.user = user;
           
            next();
        } catch (error) {
            return res.status(401).render("signIn", {
                type: "Error",
                message: "Invalid token or token expired"
            });
        }
    })


export {
    authentication,
} 
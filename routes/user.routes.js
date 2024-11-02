import express from "express";
import {authentication} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import {
    handleUserSignUp,
    handleUserSignIn,
    handleUserSignOut
} from '../controllers/user.controller.js'

const router =  express.Router();

const uploadMulterPath = upload.fields([
    { name: 'avatar', maxCount: 1 }
]);

router.route("/signup").post(uploadMulterPath, handleUserSignUp);
router.route("/signin").post(handleUserSignIn);
router.route("/signout").get(authentication,handleUserSignOut);

export default router;


//TODO:multer middleware at signup
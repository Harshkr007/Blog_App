import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

import { uploadOnCloudinary } from '../utils/cloudinary.js'

const options = {
    httpOnly: true,
    secure: true,
}

const handleUserSignUp  = asyncHandler(async (req, res) => {
    const { fullName, email, password, gender, age } = req.body;


    if (!fullName || !email || !password || !gender || !age) {
        return res.status(400).render("signUp", {
            type: "Invalid",
            message: "All fields are required"
        });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).render("signUp", {
            type: "Invalid",
            message: "Email already registered"
        });
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
        return res.status(400).render("signUp", {
            type: "Invalid",
            message: "Avatar file is required"
        });
    }

  
    const avatar = uploadOnCloudinary(avatarLocalPath);
   
    if (!avatar) {
        return res.status(400).render("signUp", {
            type: "Error",
            message: "Avatar upload failed"
        });
    }
  

    const user = await User.create({
        fullName,
        email,
        password,
        gender,
        DOB: new Date(age),
        avatar: avatar?.secure_url || "https://res.cloudinary.com/harsh-090/image/upload/v1730218039/avatar_dif24m.jpg",
    });

    if(!user){
        return res.status(500).render("signUp", {
            type: "Error",
            message: "Failed to create user"
        });
    }

    console.log("Created User:", user);

    return res.status(201).render("signIn", {
        type: "Success",
        message: "User successfully created"
    });
});

const handleUserSignIn = asyncHandler(async (req, res) => {
    //get the email and password from the user
    //check email and password exist
    //check user with email provided exist in db
    //if not throw error
    //check the password matches or not
    //if not throw error
    //genrate access token and save in cookie
    //redirect the user to the Home page

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).render("signIn", {
            type: "Invalid",
            message: "Email and Password are required"
        })
    }

    const user = await User.findOne({email});

    if (!user) {
        return res.status(401).render("signIn", {
            type: "Invalid",
            message: "Invalid credentials"
        })
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        return res.status(401).render("signIn", {
            type: "Error",
            message: "Password is incorrect"
        })
    }

    const accessToken = user.genrateAccessToken();

    res.cookie("accessToken", accessToken, options);

    return res.status(302).redirect(302, "/");

})

const handleUserSignOut = asyncHandler(async (req, res) => {
    res
        .status(200)
        .clearCookie('accessToken', options)
        .redirect("/");
})



export {
    handleUserSignUp,
    handleUserSignIn,
    handleUserSignOut
}
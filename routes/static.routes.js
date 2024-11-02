import express from "express";
import { authentication } from '../middlewares/auth.middleware.js'
import { getAllBlogSet } from "../middlewares/blog.middleware.js";

const router = express.Router();

const getAlertData = (req, res, next) => {
    const alert = req?.cookies?.alert;
    if (!alert) return next();
    req.type = alert.type;
    req.message = alert.message;
    res.clearCookie("alert");
    next();
}



router.get("/signup", getAlertData, (req, res) => {
    return res.render("signUp");
})

router.get("/signin", getAlertData, (req, res) => {
    return res.render("signIn");
})

router.get("/", getAlertData, authentication, getAllBlogSet, (req, res) => {
    return res.render("home", {
        user: req.user || null,
        blogs: req.blogs || [],
    });
});

router.get("/addBlog", getAlertData, authentication, (req, res) => {
    return res.render("addBlog", {
        user: req.user,
    });
})

router.get("/editBlog", getAlertData, authentication, (req, res) => {
    return res.render("editBlog", {})
})


export default router;
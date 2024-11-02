import express from "express";
import { handleBlogCreate, handleBlogDelete, handleBlogEdit } from "../controllers/blog.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

const uploadMulterPath = upload.fields([
    { name: 'imageFile', maxCount: 1 }
]);

router.route("/").get((req,res) => res.redirect("/"));

router.route("/create").post(uploadMulterPath,handleBlogCreate);
router.route("/edit").post(handleBlogEdit);
router.route("/delete").post(handleBlogDelete);


export default router;
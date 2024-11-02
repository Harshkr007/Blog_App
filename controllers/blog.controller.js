import asyncHandler from "../utils/asyncHandler.js"
import { Blog } from "../models/blog.model.js"
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js"


const handleBlogCreate = asyncHandler(async (req, res) => {
    const { title, createdBy, body } = req.body;

    if (!title || !createdBy || !body) {
        res.cookie("alert", {
             type: "Error",
            message: "All fields are required"
        })
        return res.status(400).redirect("/");
    }

    let postImagePath = req.files?.imageFile[0]?.path;
    if (!postImagePath) {
        res.cookie("alert", {
            type: "Error",
           message: "Image path not found"
       })
       return res.status(400).redirect("/");
    }

    const postImage = await uploadOnCloudinary(postImagePath);
    if (!postImage?.secure_url) {
        res.cookie("alert", {
            type: "Error",
           message:"File upload failed"
       })
       return res.status(400).redirect("/");
    }

    const bLog = await Blog.create({
        title: title,
        imageUrl: postImage.secure_url,
        createdBy: createdBy,
        body: body,
        likes: [],
        comments: [],
    })
    if (!bLog) {
        res.cookie("alert", {
            type: "Error",
           message: "Blog creation failed"
       })
       return res.status(400).redirect("/");
    }

    console.log("Blog created : ", bLog);

    res.cookie("alert", {
        type: "Success",
       message: "Blog created successfully"
   })
   return res.status(201).redirect("/");


})

const handleBlogEdit = asyncHandler(async (req, res) => {
    const { title, body, blogId } = req.body;

    if (!blogId) {
        return res.status(400).render("home", {
            type: "Error",
            message: "blog not found"
        })
    }

    // Find the blog post
    const blog = await Blog.findById(blogId);
    if (!blog) {
        return res.status(404).render("home", {
            type: "Error",
            message: "Blog not found"
        })
    }

    // Handle image upload if provided
    let postImagePath = req.files?.imageFile[0]?.path;
    if (postImagePath) {
        const postImage = await uploadOnCloudinary(postImagePath);
        if (!postImage) {
            return res.status(400).render("home", {
                type: "Error",
                message: "File upload failed"
            });
        }
        //delete old image
        const deleteOldImage = await deleteOnCloudinary(blog.imageUrl);
        if(!deleteOldImage){
            return res.status(400).render("home", {
                type: "Error",
                message: "Old File delete failed"
            });
        }
        blog.imageUrl = postImage.secure_url;
    }

    // Update fields if provided
    if (title) blog.title = title;
    if (body) blog.body = body;

    // Save the updated blog
    const updatedBlog = await blog.save({
        validateBeforeSave: false,
        new: true
    });

    if (!updatedBlog) {
        return res.status(400).render("home", {
            type: "Error",
            message: "Blog update failed"
        });
    }

   return res.status(200).redirect("/");
})

const handleBlogDelete = asyncHandler(async (req, res) => {
    const { user, blogId } = req.body;

    if (!user) {
        return res.status(400).render("home", {
            type: "Invalid",
            message: "user not found"
        });
    }

    if (!blogId) {
        return res.status(400).render("home", {
            type: "Invalid",
            message: "Blog remain unidentified"
        });
    }

    
    // Find and delete the blog
    const deletedBlog = await Blog.findOneAndDelete({
        _id: blogId,
        createdBy: user._id
    })

    //remove image from cloudinary
    const deleteOldImage = await deleteOnCloudinary(deletedBlog.imageUrl);
    if(!deleteOldImage){
        return res.status(400).render("home", {
            type: "Error",
            message: "Old File delete failed"
        });
    }

    if (!deletedBlog) {
        return res.status(404).render("home", {
            type: "Error",
            message: "Blog not found or unauthorized to delete"
        });
    }

    return res.status(200).redirect("/");
})

const handleLikesAdd = asyncHandler((req, res) => {

})

const handleCommentAdd = asyncHandler((req, res) => {

})

const handleGetLikesCount = asyncHandler((req, res) => {

})

const handleGetCommentCount = asyncHandler((req, res) => {

})

export {
    handleBlogCreate,
    handleBlogEdit,
    handleBlogDelete,
}

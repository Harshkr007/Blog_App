import { Blog } from "../models/blog.model.js";
import {User} from "../models/user.model.js"
import { imageCrop } from "../utils/imageCrop.js";

const getAllBlogSet = async (req,res,next) => {
   try {
     const rawBlogs = await Blog.find({});
     if(!rawBlogs){
        req.blogs = -1;
        next();
     }
 
     const blogs = await Promise.all(rawBlogs.map(async (blog) => {
         const postImageUrl = await (blog.imageUrl? imageCrop({imageUrl:blog.imageUrl,type:"Square"}):"https://res.cloudinary.com/harsh-090/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1730218039/avatar_dif24m.jpg");
 
         const postOwner = await User.findById(blog.createdBy);
 
         const postOwnerAvatar = await (postOwner.avatar? imageCrop({imageUrl: postOwner.avatar,type:"Circle"}):"https://res.cloudinary.com/harsh-090/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1730218039/avatar_dif24m.jpg");
 
         const newBlogitem = {
             blogId: blog._id,
             postImageUrl,
             postOwnerAvatar,
             postOwnerFullName : postOwner.fullName,
             postOwnerAndUserSame : (req.user._id.toString() === blog.createdBy.toString()),
             postBody : blog.body,
             likesCount : blog.likes.length,
             createdAt : blog.createdAt,
         }
 
         return newBlogitem;
     }));
 
    req.blogs = blogs;
    next();
   } catch (error) {
    return res.status(401).render("home", {
        type: "Error",
        message: "something wrong during blogs collection"
    });
   }
}

export {getAllBlogSet};

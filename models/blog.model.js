import mongoose from 'mongoose';

const people = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
},{timestamps: true});

const comment_people = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    }
},{timestamps:true})

const blogSchema = new mongoose.Schema({
    title: {
        type : String,
        require: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    likes: [people],
    comments: [comment_people],
}, {
    timestamps: true,
});

export const Blog = mongoose.model("Blog", blogSchema);
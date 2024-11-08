import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    authorMail: { type: String, required: true },
    authorName: { type: String, required: true },
    date: { type: Date, default: Date.now }, // Automatically adds the current date
    postTitle: { type: String, required: true },
    postDescription: { type: String, required: true },
    postSummary:{ type: String, required: true },
    images: [{ type: String }],
})


const PostModel = mongoose.model("Post",PostSchema);

export default PostModel;

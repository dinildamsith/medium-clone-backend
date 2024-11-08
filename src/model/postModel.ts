import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    authorMail: { type: String, required: true },
    authorName: { type: String, required: true },
    authorImage: { },
    date: { type: Date, default: Date.now }, // Automatically adds the current date
    postTitle: { type: String, required: true },
    postDescription: { type: String, required: false },
    postSummary:{ type: String, required: false },
    images: [{ type: String }],
    postClaps: { type: Number, required: false },
    postComments: [],
})


const PostModel = mongoose.model("Post",PostSchema);

export default PostModel;

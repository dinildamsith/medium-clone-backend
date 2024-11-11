import express, {Request , Response} from "express";
import PostModel from "../model/postModel";
import postModel from "../model/postModel";
import mongoose from "mongoose";

const PostController = express.Router();


//check health
PostController.get("/check-health",async (req:Request, res:Response)=>{
    res.send("work....")
})

//save post
PostController.post("/add-post",async  (req:Request, res:Response) => {

    try {

        const {authorMail,authorName,authorImage,postTitle,postDescription,postSummary,images,postClaps,postComments} = req.body

        console.log(req.body)

        if (!authorName || !postTitle || !postDescription) {
            return res.status(400).json({ message: "authorName, postTitle, and postDescription are required." });
        }

        const newPost = new postModel({
            authorMail,
            authorName,
            authorImage,
            date: new Date(), // sets the current date
            postTitle,
            postDescription,
            postSummary,
            images: images || [],
            postClaps: postClaps || 0,
            postComments: postComments || []
        })

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    }catch (error){
        res.status(500).json({ message: "Error saving post", error });
    }
})


//--------------- user All Article Get
PostController.get("/user-all-article", async (req: Request, res: Response) => {
    try {
        const authorMail = req.query.email as string; // Assuming email is passed as a query parameter

        // Ensure the email parameter is provided
        if (!authorMail) {
            return res.status(400).json({ message: "Author email is required" });
        }

        // Fetch all posts by the author
        const posts = await PostModel.find({ authorMail });

        // Check if posts exist
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this author" });
        }

        // Send the found posts in the response
        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
});


//----------for you feed have articles get
PostController.get("/for-you", async (req: Request, res: Response) => {
    try {
        const authorMail = req.query.email as string;

        // Find posts where authorMail is not equal to the given email
        const forYouPost = await PostModel.find({ authorMail: { $ne: authorMail } });

        if (forYouPost.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        return res.status(200).json(forYouPost);

    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
});


//-------------Read post get
PostController.get("/read-post", async (req: Request, res: Response) => {
    try {
        const { postId }:any = req.query; // Get postId from query parameters

        // Check if postId is valid
        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid Post ID" });
        }

        const post = await PostModel.findById(postId); // Find post by ID

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post); // Send the post data as the response
    } catch (error) {
        console.error("Error reading post:", error);
        res.status(500).json({ message: "Server error" });
    }
});


PostController.put("/add-comment", async (req: Request, res: Response) => {
    try {
        const { postId, comment, commenterName, commenterPic } = req.body;

        // Check if the required fields are provided
        if (!postId || !comment || !commenterName) {
            return res.status(400).json({ message: "postId, comment, and commenterName are required." });
        }

        // Find the post by ID
        const post = await PostModel.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Create a new comment object
        const newComment = {
            comment,
            commenterName,
            commenterPic: commenterPic || null,
            date: new Date() // Optionally, add the date for when the comment was added
        };

        // Push the new comment to the post's comments array
        post.postComments.push(newComment);

        // Save the updated post
        await post.save();

        // Respond with the updated post
        res.status(200).json({
            message: "Comment added successfully",
            post: post
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Failed to add comment", error });
    }
});


// @ts-ignore
export default PostController
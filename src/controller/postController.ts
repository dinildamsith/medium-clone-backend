import express, {Request , Response} from "express";
import PostModel from "../model/postModel";
import postModel from "../model/postModel";

const PostController = express.Router();


//check health
PostController.get("/check-health",async (req:Request, res:Response)=>{
    res.send("work....")
})

//save post
PostController.post("/add-post",async  (req:Request, res:Response) => {

    try {

        const {authorMail,authorName,postTitle,postDescription,postSummary,images} = req.body

        if (!authorName || !postTitle || !postDescription) {
            return res.status(400).json({ message: "authorName, postTitle, and postDescription are required." });
        }

        const newPost = new postModel({
                authorMail,
                authorName,
                date: new Date(),
                postTitle,
                postDescription,
                postSummary,
                images: images || []
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

export default PostController;
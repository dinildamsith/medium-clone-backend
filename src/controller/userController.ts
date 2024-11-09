import express, {Request , Response} from "express";
import UserModel from "../model/userModel";

const UserController = express.Router();

//-----------save user
UserController.post("/create-user",async  (req:Request, res:Response) => {

    const {userMail,userName,userImage,userAbout,followers,followings} = req.body

try{
    const newUser = new UserModel({
      userMail,
      userName,
      userImage,
      userAbout,
      followers: followers || [],   // Set followers to an empty array if not provided
      followings: followings || []  // Set followings to an empty array if not provided
    })

    const saveUser = newUser.save()
    res.status(201).json(saveUser);

} catch (error) {
    res.status(500).json({ message: "Error saving post", error });
}

})


//--------------search user
UserController.get("/search-user", async (req: Request, res: Response) => {
    const email = req.query.email;  // Get the email from the query parameters
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
  
    try {
      // Find the user by email
      const user = await UserModel.findOne({ userMail: email });
  
      if (user) {
        return res.status(200).json(user);  // Return the found user
      } else {
        return res.status(404).json({ message: "User not found" });  // Return a not found message
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      return res.status(500).json({ message: "Server error" });  // Handle errors with a generic server error
    }
  });


  //-----------Following handel
  UserController.put("/following", async (req: Request, res: Response) => {
    const { followerEmail, followeeEmail } = req.body; // Emails sent from the front end

    if (!followerEmail || !followeeEmail) {
        return res.status(400).json({ message: "Both follower and followee emails are required" });
    }

    try {
        // Find the follower and followee in the database
        const follower = await UserModel.findOne({ userMail: followerEmail });
        const followee = await UserModel.findOne({ userMail: followeeEmail });

        if (!follower || !followee) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if already following
        if (follower.followings.includes(followeeEmail)) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        // Update the followers and followings arrays
        follower.followings.push(followeeEmail);
        followee.followers.push(followerEmail);

        // Save both documents
        await follower.save();
        await followee.save();

        return res.status(200).json({ message: "Successfully followed the user" });
    } catch (error) {
        console.error("Error following user:", error);
        res.status(500).json({ message: "Server error, please try again later" });
    }
});

  //--------------unfollowing handel
UserController.put("/unfollowing", async (req: Request, res: Response) => {
    const { followerEmail, followeeEmail } = req.body; // Emails sent from the front end

    if (!followerEmail || !followeeEmail) {
        return res.status(400).json({ message: "Both follower and followee emails are required" });
    }

    try {
        // Find the follower and followee in the database
        const follower = await UserModel.findOne({ userMail: followerEmail });
        const followee = await UserModel.findOne({ userMail: followeeEmail });

        if (!follower || !followee) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the follower is following the followee
        if (!follower.followings.includes(followeeEmail)) {
            return res.status(400).json({ message: "You are not following this user" });
        }

        // Remove the followee from the follower's following list
        follower.followings = follower.followings.filter((email) => email !== followeeEmail);

        // Remove the follower from the followee's followers list
        followee.followers = followee.followers.filter((email) => email !== followerEmail);

        // Save both documents
        await follower.save();
        await followee.save();

        return res.status(200).json({ message: "Successfully unfollowed the user" });
    } catch (error) {
        console.error("Error unfollowing user:", error);
        return res.status(500).json({ message: "Server error, please try again later" });
    }
});





export default UserController
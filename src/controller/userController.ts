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
        followers,
        followings
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

export default UserController
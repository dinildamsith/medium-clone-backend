import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userMail: { type: String, required: true, unique:true },
    userName: { type: String, required: true },
    userImage:{ type: String, required: true },
    userAbout: { type: String, required: false },
    followers: { type: Number, required: false },
    followings: { type: Number, required: false },
})


const UserModel = mongoose.model("User",UserSchema);

export default UserModel
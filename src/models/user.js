import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: String,
        username: String,
        password: String,
    },
    {
        timestamps: true,
    }
)

const User = mongoose.models.User || mongoose.model("User", UserSchema)
export default User;
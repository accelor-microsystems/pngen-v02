import mongoose, { Schema } from "mongoose";

const MakeSchema = new Schema(
    {
        name: {
            type: String,
            required: true, // Assuming name is required, otherwise you can omit this
        },
    },
    {
        timestamps: true,
    }
);

const Make = mongoose.models.Make || mongoose.model("Make", MakeSchema);
export default Make;

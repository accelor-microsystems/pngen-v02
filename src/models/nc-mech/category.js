import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
    {
        categoryNumber: Number,
        subcatNumber: Number,
        category: String,
        subcategory: String,
        subcatDigits: Number,
    },
    {
        timestamps: true,
    }
)

const NC_Mech_Category = mongoose.models.NC_Mech_Category || mongoose.model("NC_Mech_Category", CategorySchema)
export default NC_Mech_Category;
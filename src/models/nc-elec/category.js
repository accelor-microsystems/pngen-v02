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

const NC_Elec_Category = mongoose.models.NC_Elec_Category || mongoose.model("NC_Elec_Category", CategorySchema)
export default NC_Elec_Category;
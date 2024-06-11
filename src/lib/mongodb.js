import mongoose from "mongoose";

const connectMongoDB = () => {
    if (mongoose.connections[0].readyState) {
        console.log('already connected')
        return; // already connected
    }
    try {
        mongoose.connect(process.env.MONGODB_URI)
        console.log("COnnected to db")
        return { message: 'connected' }
    }
    catch (error) {
        console.log("Error occured while connecting to MONGODB ", error)
        // throw new Error(error)
        return { message: 'error' }
    }
}

export default connectMongoDB
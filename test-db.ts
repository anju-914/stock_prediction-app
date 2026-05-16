import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function testDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);

        console.log("MongoDB Connected Successfully");

        process.exit(0);
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
}

testDB();
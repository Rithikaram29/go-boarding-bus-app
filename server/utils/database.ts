import dotenv from "dotenv";

dotenv.config();
import mongoose from "mongoose";

const mongo_uri: string = process.env.MONGO_URI!;
if (!mongo_uri) {
  throw new Error("Mongo_uri is not set");
}
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("connected to MongoDB");
    });

    mongoose.connection.on("error", (error) => {
      console.log(`error in connection:${error}`);
    });

    await mongoose
      .connect(mongo_uri)
      .then(() => console.log("Connected to MongoDB"))
      .catch((err) => console.error("Failed to connect to MongoDB:", err));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;

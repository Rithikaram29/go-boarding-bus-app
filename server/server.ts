import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";  // Import CORS package
import connectDB from "./utils/database";
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/clientRoute";
import authRoutes from "./routes/userAuthRoutes";
import authorisation from "./middlewares/authentication";

const port: number = parseInt(process.env.PORT || "4000", 10);
if (isNaN(port)) {
  throw new Error("Invalid PORT environment variable.");
}

const app: Application = express();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173",  // Allow requests from this origin (your frontend)
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"],  // Allow these headers in requests
  credentials: true,  // Allow cookies or credentials if needed
};

app.use(cors(corsOptions));  // Apply CORS middleware globally

// Connect to MongoDB
connectDB();
app.use(express.json());

// Define routes
app.get("/health",(req,res)=>{
  res.send("Server OK!")
})
app.use("/admin", authorisation, adminRoutes);
app.use("/user", userRoutes);  // Get bus does not need authorization, so no middleware is needed
app.use("/auth", authRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

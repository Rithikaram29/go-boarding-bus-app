import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import cors from "cors";  // Import CORS package
import connectDB from "./utils/database";
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/clientRoute";
import authRoutes from "./routes/userAuthRoutes";
import authorisation from "./middlewares/authentication";
import helmet from "helmet";

const port: number = parseInt(process.env.PORT || "4000", 10);
if (isNaN(port)) {
  throw new Error("Invalid PORT environment variable.");
}

const app: Application = express();

// CORS configuration
const corsOptions = {
  origin: (origin:any, callback: any) => {
    // Allow multiple specific origins or allow all
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174", // Add all your allowed origins here
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Block the request
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers in requests
  credentials: true, // Enable credentials
};

app.use(cors(corsOptions));  // Apply CORS middleware globally

// Configure CSP with Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'none'"], // Block everything by default
      fontSrc: ["'self'", "https://go-boarding-backend.onrender.com"], // Allow fonts from self and your backend
      styleSrc: ["'self'"], // Allow styles from the same origin
      scriptSrc: ["'self'"], // Allow scripts from the same origin
      imgSrc: ["'self'"], // Allow images from the same origin
    },
  })
);

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

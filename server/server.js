"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Import CORS package
const database_1 = __importDefault(require("./utils/database"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const clientRoute_1 = __importDefault(require("./routes/clientRoute"));
const userAuthRoutes_1 = __importDefault(require("./routes/userAuthRoutes"));
const authentication_1 = __importDefault(require("./middlewares/authentication"));
const port = parseInt(process.env.PORT || "4000", 10);
if (isNaN(port)) {
    throw new Error("Invalid PORT environment variable.");
}
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: "http://localhost:5173", // Allow requests from this origin (your frontend)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers in requests
    credentials: true, // Allow cookies or credentials if needed
};
app.use((0, cors_1.default)(corsOptions)); // Apply CORS middleware globally
// Connect to MongoDB
(0, database_1.default)();
app.use(express_1.default.json());
// Define routes
app.get("/health", (req, res) => {
    res.send("Server OK!");
});
app.use("/admin", authentication_1.default, adminRoutes_1.default);
app.use("/user", clientRoute_1.default); // Get bus does not need authorization, so no middleware is needed
app.use("/auth", userAuthRoutes_1.default);
// Start server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

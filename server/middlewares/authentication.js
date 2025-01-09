"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import secretkey from "../utils/constants";
const secretkey = process.env.SECRET_KEY;
if (!secretkey) {
    throw new Error("Secret key is not set!");
}
const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        res
            .status(401)
            .json({ message: "Unauthorized: Missing or invalid token!" });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const user = jsonwebtoken_1.default.verify(token, secretkey);
        if (!user || !user._id || !user.email || !user.role) {
            console.log("Invalid Token Payload:", user);
            res.status(403).json({ message: "Forbidden: Invalid payload structure" });
            return;
        }
        const use = jsonwebtoken_1.default.verify(token, secretkey);
        console.log("Decoded Token:", use);
        req.user = use;
        next();
    }
    catch (err) {
        console.error("JWT verification error:", err.message);
        if (err.name === "TokenExpiredError") {
            res.status(403).json({ message: "Forbidden: Token expired" });
        }
        else {
            res.status(403).json({ message: "Forbidden: Invalid Token" });
        }
    }
};
exports.default = authenticateToken;

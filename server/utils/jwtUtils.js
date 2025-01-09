"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// import secretkey from "./constants";
const secretkey = process.env.SECRET_KEY;
if (!secretkey) {
    throw new Error("SecretKey not set!");
}
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//generate token
const generateToken = (user) => {
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
    };
    return jsonwebtoken_1.default.sign(payload, secretkey, { expiresIn: "3h" });
};
exports.generateToken = generateToken;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
// Generate a random secret key
const generateSecretKey = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
const secretKey = generateSecretKey();
// console.log("Secret Key:", secretKey);
exports.default = secretKey;

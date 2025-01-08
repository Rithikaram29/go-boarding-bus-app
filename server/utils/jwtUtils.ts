import dotenv from "dotenv";
dotenv.config();
import { Types } from "mongoose";
// import secretkey from "./constants";
const secretkey: string = process.env.SECRET_KEY!;
if (!secretkey) {
  throw new Error("SecretKey not set!");
}

import jwt from "jsonwebtoken";

//payload interface
interface Payload {
  _id: Types.ObjectId;
  email: string;
  role: string;
}

interface User {
  _id: Types.ObjectId;
  email: string;
  role: string;
}

//generate token
const generateToken = (user: User): any => {
  const payload: Payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, secretkey, { expiresIn: "3h" });
};

export { generateToken };

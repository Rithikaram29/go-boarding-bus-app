import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { Types } from "mongoose";
// import secretkey from "../utils/constants";

const secretkey = process.env.SECRET_KEY!;
if (!secretkey) {
  throw new Error("Secret key is not set!");
}

interface CustomRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    email: string;
    role: string;
  };
}

const authenticateToken: RequestHandler = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");

  if (!authHeader ) {
    res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token!" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, secretkey) as {
      _id: Types.ObjectId;
      email: string;
      role: string;
    };

    if (!user || !user._id || !user.email || !user.role) {
      console.log("Invalid Token Payload:", user)
      res.status(403).json({ message: "Forbidden: Invalid payload structure" });
      return;
    }

    const use: any = jwt.verify(token, secretkey);
    console.log("Decoded Token:", use);

    req.user = use;
    next();
  } catch (err: any) {
    console.error("JWT verification error:", err.message);
    if (err.name === "TokenExpiredError") {
      res.status(403).json({ message: "Forbidden: Token expired" });
    } else {
      res.status(403).json({ message: "Forbidden: Invalid Token" });
    }
  }
};

export default authenticateToken;

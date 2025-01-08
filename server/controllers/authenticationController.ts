import { User, UserRole } from "../models/userDetailModel";
import bcrypt from "bcrypt";
import { Request, Response, RequestHandler, NextFunction } from "express";
import { Types } from "mongoose";


import { generateToken } from "../utils/jwtUtils";

interface CustomRequest extends Request {
  user?: { _id: Types.ObjectId; email: string; role: string };
}

//registration
const userRegistration: RequestHandler = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let { userName, phone, email, password, role, name } = req.body;

    //check unique userName
    const uniqueUsername = await User.find({userName});
    console.log(uniqueUsername)
    if(uniqueUsername.length !== 0){
      res.status(500).json({error: "UserName already present! Change Username"});
      return;
    }

    const salt: number = 10;

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      userName,
      phone,
      email,
      password: hashedPassword,
      name,
      role,
    });

    console.log(newUser)

    if (!newUser) {
      res.status(400);
      throw new Error("Cannot create user");
    }

    res
      .status(201)
      .json({ user: newUser, message: "User created Successfully!" });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

//userlogin
const userLogin: RequestHandler = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userName, password } = req.body;

    const currentUser: any = await User.findOne({ userName: userName });

    if (!currentUser) {
      res.status(404).json({ error: "User not found!" });
      return;
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      currentUser.password
    );

    if (!passwordCorrect) {
      res.status(400);
      throw new Error("Password incorrect!");
    }

    const token = generateToken(currentUser);

   
    res.status(200).json(token);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { userRegistration, userLogin };

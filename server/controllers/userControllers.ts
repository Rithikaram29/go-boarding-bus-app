import { User, UserRole } from "../models/userDetailModel";
import DataQueryAbstraction from "../abstraction/databaseMethodAbstraction";
import { Request, RequestHandler, Response } from "express";
import { Types } from "mongoose";

const userControl = new DataQueryAbstraction(User);

interface CustomRequest extends Request {
  user?: { _id: Types.ObjectId; email: string; role: string };
}

const getUser: RequestHandler = async (req: CustomRequest, res: Response) => {
  if(!req.user){
    res.status(404).json({error: "request user missing"});
    console.log("request user missing")
    return;
  }
  const userId: any = req.user?._id;
 
  if (!userId) {
    res.status(400).json({ error: "User Does Not Exist!" });
    return;
  }
    try {
      const userId: Types.ObjectId | undefined = req.user?._id; // Ensure userId exists
      if (!userId) {
        res.status(400).json({ error: "User ID is missing!" });
        return;
      }
  
      // Use find to fetch documents
      const currentUser: any = await userControl.find({ _id: userId });
  
      // Handle the case where no user is found
      if (!currentUser || currentUser.length === 0) {
        res.status(404).json({ error: "User not found!" });
        console.log("User not found!")
        return;
      }
      console.log(currentUser)
      res.status(200).json(currentUser);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  
export { getUser };

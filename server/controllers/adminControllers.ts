import Bus from "../models/busModel";
import { Request, RequestHandler, Response } from "express";
import { User, UserRole } from "../models/userDetailModel";
import { Types } from "mongoose";
import DateModel from "../models/calendarModel";
import DataQueryAbstraction from "../abstraction/databaseMethodAbstraction";


const busServices = new DataQueryAbstraction(Bus);
const userControl = new DataQueryAbstraction(User);
const calendarServices = new DataQueryAbstraction(DateModel);

interface CustomRequest extends Request {
  user?: { _id: Types.ObjectId; email: string; role: string };
}

//creating the bus
const createBus: RequestHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const userId: any = req.user?._id;
    const role = req.user?.role;

    if (role !== UserRole.ADMIN) {
      res.status(403).json({ error: "Not Authorized" });
      return;
    }

    if (!userId) {
      res.status(400).json({ error: "User Does Not Exist!" });
      return;
    }

    // Check for existing bus
    const busNo = req.body.busNo;
    if(!busNo){
      res.status(401).json({error: "Bus number is required!"});
      return;
    }
    const existingBus = await busServices.findOne({ busNo: req.body.busNo });

    // const existingBus = allexistingBus[0]
    if (existingBus) {
      res.status(400).json({ error: "Bus already exists!" , Bus: existingBus });
      return;
    }

    // Create the new bus
    const newBus = await busServices.create(req.body);
    if (!newBus) {
      res.status(400).json({ error: "Cannot create Bus!" });
      return;
    }

    // Add bus to user
    const newBusId = newBus._id;
    await userControl.findOneAndUpdate(
      { _id: userId },
      { $push: { bus: newBusId } }
    );

    // Respond with the newly created bus
    res.status(201).json(newBus);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


//resetting the bus tickets
const resetTickets: RequestHandler = async (
  req: CustomRequest,
  res: Response
) => {
  const busId = req.params.id;
  const { date } = req.body;
  try {
    const currentDay: any = calendarServices.find({ date: date });

    if (!currentDay || currentDay.length === 0) {
      res.status(404).json({ error: "Date not found in the calendar." });
      return;
    }

    //buses for the day
    const buses = currentDay[0].bus;

    //Finding our bus
    const currentBus = buses.find((bus: any) => bus.busId.toString() === busId);

    if (!currentBus) {
      res.status(404).json({ error: "Could not find bus." });
      return;
    }

    currentBus.bookedSeats = [];

    res.status(200).json({ message: "Tickets reset successful." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//get buses
const getBuses: RequestHandler = async (req: CustomRequest, res: Response) => {
  try {
    let role: string | undefined = req.user?.role;

    if (role !== "admin") {
      res.status(403).json({ error: "Not Authorised!" });
      return;
    }

    const userId = req.user?._id;
    let currentUser: any = await userControl.populate({ _id: userId }, { path: "bus", model: "Bus" });

    console.log(currentUser[0])
    if (!currentUser) {
      res.status(404).json({ error: "Could not find User" });
      return;
    }

    const buses = currentUser[0].bus;
    console.log(buses)
    if (!buses) {
      res.status(404).json({ error: "Could not find buses" });
      return;
    }

    res.status(202).json(buses);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

//get bus detail for particular date
const getBusdetails: RequestHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const role = req.user?.role;

  // Check if the user has admin privileges
  if (role !== "admin") {
    res.status(403).json({ error: "Not Authorised!" });
    return;
  }

  try {
    const busId = req.params.id;

    const bus = await busServices.populate({ _id: busId }, { path: "trips.bookedSeats.bookedBy", model: "User" });

    console.log(bus);

    res.status(200).json(bus);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const updateBus: RequestHandler = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  try {
    const userId: any = req.user?._id;
    const role = req.user?.role;

    // Check if the user has admin privileges
    if (role !== UserRole.ADMIN) {
      res.status(403).json({ error: "Not Authorized" });
      return;
    }

    if (!userId) {
      res.status(400).json({ error: "User Does Not Exist!" });
      return;
    }

    const busNo = req.params.id;
    const updateData = req.body;

    // Check if the bus exists
    const existingBus = await busServices.findOne({ busNo: busNo });
    if (!existingBus) {
      res.status(404).json({ error: "Bus not found!" });
      return;
    }

    // Update the bus with the provided data
    const updatedBus = await busServices.findOneAndUpdate(
      { busNo: busNo },
      updateData
    );

    if (!updatedBus) {
      res.status(400).json({ error: "Failed to update the bus!" });
      return;
    }

    res.status(200).json({
      message: "Bus updated successfully!",
      bus: updatedBus,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};




export { createBus, resetTickets, getBuses, getBusdetails, updateBus};

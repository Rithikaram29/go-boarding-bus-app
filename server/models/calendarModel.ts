import mongoose, { Model, Types } from "mongoose";
import SchemaAbstraction from "../abstraction/modelAbstraction";
import { User, UserRole } from "./userDetailModel";
import Bus from "../models/busModel";

const schemaAbstraction = new SchemaAbstraction();

//interface
interface Calendar extends Document {
  date: string;
  bus: [
    {
      busId: mongoose.Schema.Types.ObjectId;
      bookedSeats: [
        {
          seatNumber: string;
          bookedBy: mongoose.Schema.Types.ObjectId;
          assignedTo: string;
        }
      ];
    }
  ];
}


//schema and model
schemaAbstraction.defineSchema("Calendar", {
  date: {
    type: String,
    required: true,
  },
  bus: [
    {
      busNo: {
        type: String,
        required: true,
      },
      bookedSeats: [
        {
          seatNumber: {
            type: String,
            required: true,
          },
          bookedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          assignedTo: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});


const DateModel: any = schemaAbstraction.getModel("Calendar");

export default DateModel;

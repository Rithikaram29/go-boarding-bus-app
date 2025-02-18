import mongoose, { Types, Document, Schema } from "mongoose";
import SchemaAbstraction from "../abstraction/modelAbstraction";

const schemaAbstraction = new SchemaAbstraction();

// Define interfaces for TypeScript
interface BookedSeat {
  SeatNumber: string;
  assignedTo: string;
  bookedBy: Types.ObjectId;
}

interface Trip {
  pickuplocation: string;
  pickupDateTime: Date;
  dropLocation: string;
  dropDateTime: Date;
  bookedSeats: BookedSeat[];
}

interface SeatsStructure {
  noOfSeatsInRowLeft: number;
  noOfSeatsInRowRight: number;
  noOfRowsInTotal: number;
  noOfSeatsInLastRow: number;
}

interface Bus extends Document {
  busNo: string;
  busName: string;
  isAc: boolean;
  seats: SeatsStructure;
  trips: Trip[];
}

// Define Seat schema for booked seats
const bookedSeatSchema = schemaAbstraction.createSubSchema({
  SeatNumber: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: String,
    required: true,
  },
  bookedBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Define Trip schema
const tripSchema = schemaAbstraction.createSubSchema({
  pickuplocation: {
    type: String,
    required: true,
  },
  pickupDateTime: {
    type: Date,
    required: true,
  },
  dropLocation: {
    type: String,
    required: true,
  },
  dropDateTime: {
    type: Date,
    required: true,
  },
  bookedSeats: {
    type: [bookedSeatSchema],
    required: true,
  },
});

// Define Seats structure
const seatsStructureSchema = schemaAbstraction.createSubSchema({
  noOfSeatsInRowLeft: {
    type: Number,
    required: true,
  },
  noOfSeatsInRowRight: {
    type: Number,
    required: true,
  },
  noOfRowsInTotal: {
    type: Number,
    required: true,
  },
  noOfSeatsInLastRow: {
    type: Number,
    required: true,
  },
});

// Define Bus schema
schemaAbstraction.defineSchema("Bus", {
  busNo: {
    type: String,
    required: true,
    unique: true,
  },
  busName: {
    type: String,
    required: true,
  },
  isAc: {
    type: Boolean,
    default: false,
  },
  seats: {
    type: seatsStructureSchema,
    required: true,
  },
  trips: {
    type: [tripSchema],
    required: true,
  },
});

const BusModel =schemaAbstraction.getModel("Bus");

// Pre-save hook to convert dates
BusModel.schema.pre('save', function (next) {
  // Access the trips and convert the date fields if they are string representations
  const bus = this as any;  // Using 'any' to access dynamic properties

  bus.trips.forEach((trip: any) => {
    if (typeof trip.pickupDateTime === "string") {
      trip.pickupDateTime = new Date(trip.pickupDateTime);
    }
    if (typeof trip.dropDateTime === "string") {
      trip.dropDateTime = new Date(trip.dropDateTime);
    }
  });

  next();
});


export default BusModel;

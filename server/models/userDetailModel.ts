import mongoose, { Model, Document, Schema, Types } from "mongoose";
import SchemaAbstraction from "../abstraction/modelAbstraction";

const schemaAbstraction = new SchemaAbstraction();

enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

type UserRoleType = keyof typeof UserRole;

//interface for typeScript
interface ITickets extends Document {
  busNo: Types.ObjectId | string;
  seats: {
    seatNo: string;
    name: string;
  }[];
}

interface NewUser extends Document {
  userName: string;
  phone: number;
  email: string;
  password: string;
  role: UserRole;
  name?: string;
  tickets?: ITickets[];
  bus?: Types.ObjectId[];
}

schemaAbstraction.defineSchema("User", {
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
  },

  name: { type: String },

  tickets: [
    {
      busNo: {
        type: String,
        required: false,
      },
      date: {
        type: Date,
        required: false,
      },
      seats: [
        {
          seatNo: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],

  bus: [
    {
      type: Types.ObjectId,
      ref: "Bus",
      required: false,
    },
  ],
});

const User: Model<NewUser> = schemaAbstraction.getModel("User");

export { User, UserRole };

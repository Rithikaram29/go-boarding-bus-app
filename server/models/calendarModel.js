"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const modelAbstraction_1 = __importDefault(require("../abstraction/modelAbstraction"));
const schemaAbstraction = new modelAbstraction_1.default();
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
                        type: mongoose_1.default.Schema.Types.ObjectId,
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
const DateModel = schemaAbstraction.getModel("Calendar");
exports.default = DateModel;

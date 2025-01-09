"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.User = void 0;
const mongoose_1 = require("mongoose");
const modelAbstraction_1 = __importDefault(require("../abstraction/modelAbstraction"));
const schemaAbstraction = new modelAbstraction_1.default();
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["CUSTOMER"] = "customer";
})(UserRole || (exports.UserRole = UserRole = {}));
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
            type: mongoose_1.Types.ObjectId,
            ref: "Bus",
            required: false,
        },
    ],
});
const User = schemaAbstraction.getModel("User");
exports.User = User;

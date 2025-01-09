"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const userDetailModel_1 = require("../models/userDetailModel");
const databaseMethodAbstraction_1 = __importDefault(require("../abstraction/databaseMethodAbstraction"));
const userControl = new databaseMethodAbstraction_1.default(userDetailModel_1.User);
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!req.user) {
        res.status(404).json({ error: "request user missing" });
        console.log("request user missing");
        return;
    }
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!userId) {
        res.status(400).json({ error: "User Does Not Exist!" });
        return;
    }
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id; // Ensure userId exists
        if (!userId) {
            res.status(400).json({ error: "User ID is missing!" });
            return;
        }
        // Use find to fetch documents
        const currentUser = yield userControl.find({ _id: userId });
        // Handle the case where no user is found
        if (!currentUser || currentUser.length === 0) {
            res.status(404).json({ error: "User not found!" });
            console.log("User not found!");
            return;
        }
        console.log(currentUser);
        res.status(200).json(currentUser);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getUser = getUser;

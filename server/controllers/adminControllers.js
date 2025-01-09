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
exports.updateBus = exports.getBusdetails = exports.getBuses = exports.resetTickets = exports.createBus = void 0;
const busModel_1 = __importDefault(require("../models/busModel"));
const userDetailModel_1 = require("../models/userDetailModel");
const calendarModel_1 = __importDefault(require("../models/calendarModel"));
const databaseMethodAbstraction_1 = __importDefault(require("../abstraction/databaseMethodAbstraction"));
const busServices = new databaseMethodAbstraction_1.default(busModel_1.default);
const userControl = new databaseMethodAbstraction_1.default(userDetailModel_1.User);
const calendarServices = new databaseMethodAbstraction_1.default(calendarModel_1.default);
//creating the bus
const createBus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        if (role !== userDetailModel_1.UserRole.ADMIN) {
            res.status(403).json({ error: "Not Authorized" });
            return;
        }
        if (!userId) {
            res.status(400).json({ error: "User Does Not Exist!" });
            return;
        }
        // Check for existing bus
        const busNo = req.body.busNo;
        if (!busNo) {
            res.status(401).json({ error: "Bus number is required!" });
            return;
        }
        const existingBus = yield busServices.findOne({ busNo: req.body.busNo });
        // const existingBus = allexistingBus[0]
        if (existingBus) {
            res.status(400).json({ error: "Bus already exists!", Bus: existingBus });
            return;
        }
        // Create the new bus
        const newBus = yield busServices.create(req.body);
        if (!newBus) {
            res.status(400).json({ error: "Cannot create Bus!" });
            return;
        }
        // Add bus to user
        const newBusId = newBus._id;
        yield userControl.findOneAndUpdate({ _id: userId }, { $push: { bus: newBusId } });
        // Respond with the newly created bus
        res.status(201).json(newBus);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createBus = createBus;
//resetting the bus tickets
const resetTickets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const busId = req.params.id;
    const { date } = req.body;
    try {
        const currentDay = calendarServices.find({ date: date });
        if (!currentDay || currentDay.length === 0) {
            res.status(404).json({ error: "Date not found in the calendar." });
            return;
        }
        //buses for the day
        const buses = currentDay[0].bus;
        //Finding our bus
        const currentBus = buses.find((bus) => bus.busId.toString() === busId);
        if (!currentBus) {
            res.status(404).json({ error: "Could not find bus." });
            return;
        }
        currentBus.bookedSeats = [];
        res.status(200).json({ message: "Tickets reset successful." });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.resetTickets = resetTickets;
//get buses
const getBuses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        if (role !== "admin") {
            res.status(403).json({ error: "Not Authorised!" });
            return;
        }
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        let currentUser = yield userControl.populate({ _id: userId }, { path: "bus", model: "Bus" });
        console.log(currentUser[0]);
        if (!currentUser) {
            res.status(404).json({ error: "Could not find User" });
            return;
        }
        const buses = currentUser[0].bus;
        console.log(buses);
        if (!buses) {
            res.status(404).json({ error: "Could not find buses" });
            return;
        }
        res.status(202).json(buses);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getBuses = getBuses;
//get bus detail for particular date
const getBusdetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
    // Check if the user has admin privileges
    if (role !== "admin") {
        res.status(403).json({ error: "Not Authorised!" });
        return;
    }
    try {
        const busId = req.params.id;
        const bus = yield busServices.populate({ _id: busId }, { path: "trips.bookedSeats.bookedBy", model: "User" });
        console.log(bus);
        res.status(200).json(bus);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getBusdetails = getBusdetails;
const updateBus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        // Check if the user has admin privileges
        if (role !== userDetailModel_1.UserRole.ADMIN) {
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
        const existingBus = yield busServices.findOne({ busNo: busNo });
        if (!existingBus) {
            res.status(404).json({ error: "Bus not found!" });
            return;
        }
        // Update the bus with the provided data
        const updatedBus = yield busServices.findOneAndUpdate({ busNo: busNo }, updateData);
        if (!updatedBus) {
            res.status(400).json({ error: "Failed to update the bus!" });
            return;
        }
        res.status(200).json({
            message: "Bus updated successfully!",
            bus: updatedBus,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateBus = updateBus;

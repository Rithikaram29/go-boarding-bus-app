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
exports.getBusdetails = exports.cancelTicket = exports.bookTicket = void 0;
const busModel_1 = __importDefault(require("../models/busModel"));
const userDetailModel_1 = require("../models/userDetailModel");
const databaseMethodAbstraction_1 = __importDefault(require("../abstraction/databaseMethodAbstraction"));
const calendarModel_1 = __importDefault(require("../models/calendarModel"));
const busServices = new databaseMethodAbstraction_1.default(busModel_1.default);
const userControl = new databaseMethodAbstraction_1.default(userDetailModel_1.User);
const dateControl = new databaseMethodAbstraction_1.default(calendarModel_1.default);
//interface structure
var SeatType;
(function (SeatType) {
    SeatType["SingleSleeper"] = "single sleeper";
    SeatType["DoubleSleeper"] = "double sleeper";
    SeatType["Seater"] = "seater";
})(SeatType || (SeatType = {}));
// To book tickets
const bookTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const busNo = req.params.id;
    const { date, seats } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    // Check for user role
    if (role !== userDetailModel_1.UserRole.CUSTOMER) {
        throw new Error("Not Authorized");
    }
    try {
        // Check for user existence
        const currentUser = yield userControl.findById(userId);
        if (!currentUser) {
            res.status(404).json({ error: "User not found!" });
            return;
        }
        // Check for bus existence
        const currentBus = yield busServices.findOne({ busNo: busNo });
        if (!currentBus) {
            res.status(404).json({ error: "Bus not found" });
            return;
        }
        // Parse and filter trips for the given date (normalized to midnight)
        const parsedDate = new Date(date);
        parsedDate.setHours(0, 0, 0, 0); // Set to midnight
        const nextDay = new Date(parsedDate);
        nextDay.setDate(parsedDate.getDate() + 1);
        // Find the trip that matches the selected date (considering time zone)
        const trip = currentBus.trips.find((trip) => {
            const tripDate = new Date(trip.pickupDateTime);
            tripDate.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
            return tripDate >= parsedDate && tripDate < nextDay;
        });
        if (!trip) {
            res.status(404).json({ error: "No trips found for the selected date" });
            return;
        }
        // Ensure `bookedSeats` array exists in the trip
        if (!trip.bookedSeats) {
            trip.bookedSeats = [];
        }
        // Extract customer seat details
        const customerSeats = seats; // { seats: [{ seatNo: "", name: "" }] }
        const customerSeatNumbers = customerSeats.map((seat) => seat.seatNo);
        // Check if any of the requested seats are already booked
        const alreadyBookedSeats = trip.bookedSeats.filter((seat) => customerSeatNumbers.includes(seat.SeatNumber));
        // If seats are already booked, return error
        if (alreadyBookedSeats.length > 0) {
            res.status(400).json({
                error: "Some seats are already booked",
                seatNumbers: alreadyBookedSeats.map((booked) => booked.seatNumber),
            });
            return;
        }
        // Update `bookedSeats` in the bus model
        const newBookedSeats = customerSeats.map((seat) => ({
            SeatNumber: seat.seatNo,
            assignedTo: seat.name,
            bookedBy: userId,
        }));
        trip.bookedSeats.push(...newBookedSeats);
        // Add ticket details to the user's `tickets`
        const newTicket = {
            busNo: busNo,
            date: trip.pickupDateTime, // Use the exact pickup date for the trip
            seats: customerSeats.map((seat) => ({
                seatNo: seat.seatNo,
                name: seat.name,
            })),
        };
        if (!currentUser.tickets) {
            currentUser.tickets = [];
        }
        // Add the new ticket to the user's tickets array
        currentUser.tickets.push(newTicket);
        // Save updates to the bus and user models
        yield busServices.save(currentBus);
        yield userControl.save(currentUser);
        res
            .status(200)
            .json({
            message: "Tickets booked successfully!",
            currentBus,
            currentUser,
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.bookTicket = bookTicket;
//To cancel tickets
const cancelTicket = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const busNo = req.params.id;
    const { date, seatNo } = req.body; // Assume req.body contains { date, seatNo }
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
    // Check for user role
    if (role !== userDetailModel_1.UserRole.CUSTOMER) {
        throw new Error("Not Authorized");
    }
    try {
        // Check for user existence
        const currentUser = yield userControl.findOne({ _id: userId });
        if (!currentUser) {
            res.status(404).json({ error: "User not found!" });
            return;
        }
        // Normalize the date provided in the request
        const parsedDate = new Date(date);
        parsedDate.setHours(0, 0, 0, 0); // Normalize to midnight to avoid time comparison issues
        // Find the ticket for the specific bus and date
        const ticket = currentUser.tickets.find((ticket) => {
            const ticketDate = new Date(ticket.date);
            ticketDate.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
            return ticket.busNo === busNo && ticketDate.getTime() === parsedDate.getTime();
        });
        if (!ticket) {
            res.status(404).json({ error: "Ticket not found for the given bus and date" });
            return;
        }
        // Check if the seat exists in the user's ticket
        const seat = ticket.seats.find((seat) => seat.seatNo === seatNo);
        if (!seat) {
            res.status(404).json({ error: "Seat not found in the user's ticket" });
            return;
        }
        // Remove the seat from the user's ticket
        ticket.seats = ticket.seats.filter((seat) => seat.seatNo !== seatNo);
        // If there are no seats left in the ticket, remove the ticket from the user's profile
        if (ticket.seats.length === 0) {
            currentUser.tickets = currentUser.tickets.filter((userTicket) => userTicket.busNo !== busNo || userTicket.date !== date);
        }
        // Update the user's tickets in the database
        yield userControl.update({ _id: userId }, { tickets: currentUser.tickets });
        // Find the bus and update its bookedSeats
        const currentBus = yield busServices.findOne({ busNo: busNo });
        if (!currentBus) {
            res.status(404).json({ error: "Bus not found" });
            return;
        }
        const trip = currentBus.trips.find((trip) => {
            const tripDate = new Date(trip.pickupDateTime);
            tripDate.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
            return tripDate.getTime() === parsedDate.getTime();
        });
        if (!trip) {
            res.status(404).json({ error: "No trip found for the given date" });
            return;
        }
        // Remove the canceled seat from the bus trip's bookedSeats
        trip.bookedSeats = trip.bookedSeats.filter((seat) => seat.SeatNumber !== seatNo);
        // Update the bus model
        yield busServices.update({ busNo: busNo }, { trips: currentBus.trips });
        res.status(200).json({ message: "Ticket canceled successfully!", currentBus, currentUser });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.cancelTicket = cancelTicket;
//Get bus details
const getBusdetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract query parameters
        const { from, to, date } = req.query;
        // Validate input parameters
        if (!date || !from || !to) {
            res
                .status(400)
                .json({ error: "Missing required parameters: date, from, or to." });
            return;
        }
        // Parse the date string to a Date object and set time to midnight
        const parsedDate = new Date(date);
        parsedDate.setHours(0, 0, 0, 0); // Set time to midnight of the given date
        // Create a query range for the date (from midnight to just before the next day)
        const nextDay = new Date(parsedDate);
        nextDay.setDate(parsedDate.getDate() + 1); // Set nextDay to the same time but the following day
        // Find buses based on the date range and the pickup/drop locations
        const buses = yield busServices.find({
            trips: {
                $elemMatch: {
                    pickuplocation: from,
                    dropLocation: to,
                    pickupDateTime: {
                        $gte: parsedDate, // Greater than or equal to the start of the day
                        $lt: nextDay, // Less than the start of the next day
                    },
                },
            },
        });
        if (buses.length === 0) {
            res
                .status(404)
                .json({ error: "No buses available for the selected route." });
            return;
        }
        // Return the updated list of buses with seat availability
        res.status(200).json(buses);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getBusdetails = getBusdetails;

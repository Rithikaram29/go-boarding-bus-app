"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientController_1 = require("../controllers/clientController");
const userControllers_1 = require("../controllers/userControllers");
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const router = (0, express_1.Router)();
router.get("/findbus", clientController_1.getBusdetails);
router.get("/account", authentication_1.default, userControllers_1.getUser);
router.put("/book-ticket/:id", authentication_1.default, clientController_1.bookTicket);
router.put("/cancel-ticket/:id", authentication_1.default, clientController_1.cancelTicket);
exports.default = router;

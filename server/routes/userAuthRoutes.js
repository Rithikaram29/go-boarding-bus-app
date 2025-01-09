"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const authenticationController_1 = require("../controllers/authenticationController");
const cors_1 = __importDefault(require("cors"));
router.use((0, cors_1.default)());
router.post("/signup", authenticationController_1.userRegistration);
router.post("/login", authenticationController_1.userLogin);
exports.default = router;

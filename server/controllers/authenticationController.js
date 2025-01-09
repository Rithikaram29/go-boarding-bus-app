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
exports.userLogin = exports.userRegistration = void 0;
const userDetailModel_1 = require("../models/userDetailModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtUtils_1 = require("../utils/jwtUtils");
//registration
const userRegistration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { userName, phone, email, password, role, name } = req.body;
        //check unique userName
        const uniqueUsername = yield userDetailModel_1.User.find({ userName });
        console.log(uniqueUsername);
        if (uniqueUsername.length !== 0) {
            res.status(500).json({ error: "UserName already present! Change Username" });
            return;
        }
        const salt = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield userDetailModel_1.User.create({
            userName,
            phone,
            email,
            password: hashedPassword,
            name,
            role,
        });
        console.log(newUser);
        if (!newUser) {
            res.status(400);
            throw new Error("Cannot create user");
        }
        res
            .status(201)
            .json({ user: newUser, message: "User created Successfully!" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
exports.userRegistration = userRegistration;
//userlogin
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        const currentUser = yield userDetailModel_1.User.findOne({ userName: userName });
        if (!currentUser) {
            res.status(404).json({ error: "User not found!" });
            return;
        }
        const passwordCorrect = yield bcrypt_1.default.compare(password, currentUser.password);
        if (!passwordCorrect) {
            res.status(400);
            throw new Error("Password incorrect!");
        }
        const token = (0, jwtUtils_1.generateToken)(currentUser);
        res.status(200).json(token);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.userLogin = userLogin;

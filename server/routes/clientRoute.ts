import { Router } from "express";

import {
  bookTicket,
  cancelTicket,
  getBusdetails,
} from "../controllers/clientController";

import { getUser } from "../controllers/userControllers";

import authenticateToken from "../middlewares/authentication";

const router = Router();

router.get("/findbus", getBusdetails);
router.get("/account",authenticateToken, getUser);
router.put("/book-ticket/:id",authenticateToken, bookTicket);
router.put("/cancel-ticket/:id",authenticateToken, cancelTicket);

export default router;

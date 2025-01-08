import { Router } from "express";

import {
  createBus,
  resetTickets,
  getBuses,
  getBusdetails,
  updateBus
} from "../controllers/adminControllers";

const router = Router();

router.get("/bus", getBuses);


router.get("/bus/details/:id", getBusdetails)
router.post("/bus/create", createBus);
router.put("/bus/add-trip/:id", updateBus)
router.put("/ticket-reset/:id", resetTickets);

export default router;

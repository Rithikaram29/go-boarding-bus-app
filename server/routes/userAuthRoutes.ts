import { Router } from "express";
const router = Router();
import {
  userRegistration,
  userLogin,
} from "../controllers/authenticationController";
import cors from "cors";

router.use(cors());

router.post("/signup", userRegistration);
router.post("/login", userLogin);

export default router;

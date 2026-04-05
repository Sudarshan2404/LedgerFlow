import { Router } from "express";
import { changerole, login, register } from "../controllers/authControllers.js";
import { Authmiddleware } from "../middleware/authmiddleware.js";
import { AdminRole } from "../middleware/RoleMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/updaterole/:id", Authmiddleware, AdminRole, changerole);

export default router;

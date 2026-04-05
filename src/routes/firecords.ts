import { Router } from "express";
import { login, register } from "../controllers/authControllers.js";
import { AdminRole } from "../middleware/RoleMiddleware.js";
import { addRecord } from "../controllers/crudControllers.js";
import { Authmiddleware } from "../middleware/authmiddleware.js";

const router = Router();

router.post("/addrecords", Authmiddleware, AdminRole, addRecord);

export default router;

import { Router } from "express";
import { login, register } from "../controllers/authControllers.js";
import { AdminRole, allowRoles } from "../middleware/RoleMiddleware.js";
import {
  addRecord,
  deleteRecord,
  getAllRecords,
  getDashboard,
  getRecordbyId,
  updateRecord,
} from "../controllers/crudControllers.js";
import { Authmiddleware } from "../middleware/authmiddleware.js";

const router = Router();

router.get("/records", Authmiddleware, getAllRecords);
router.get("/getrecord/:id", Authmiddleware, getRecordbyId);
router.post(
  "/addrecords",
  Authmiddleware,
  allowRoles("ADMIN", "ANALYST"),
  addRecord,
);
router.patch(
  "/updaterecord",
  Authmiddleware,
  allowRoles("ADMIN", "ANALYST"),
  updateRecord,
);
router.delete(
  "/deleterecord",
  Authmiddleware,
  allowRoles("ADMIN", "ANALYST"),
  deleteRecord,
);
router.get("/dashboard", Authmiddleware, getDashboard);

export default router;

import { Router } from "express";
import { login, register } from "../controllers/authControllers.js";
import { AdminRole } from "../middleware/RoleMiddleware.js";
import {
  addRecord,
  deleteRecord,
  getAllRecords,
  getRecordbyId,
  updateRecord,
} from "../controllers/crudControllers.js";
import { Authmiddleware } from "../middleware/authmiddleware.js";

const router = Router();

router.get("/records", Authmiddleware, getAllRecords);
router.get("/getrecord/:id", Authmiddleware, getRecordbyId);
router.post("/addrecords", Authmiddleware, AdminRole, addRecord);
router.patch("/updaterecord", Authmiddleware, AdminRole, updateRecord);
router.delete("/deleterecord", Authmiddleware, AdminRole, deleteRecord);

export default router;

import Express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import Authroutes from "./routes/Authroutes.js";
import jwt from "jsonwebtoken";
import { success } from "zod";
import { Authmiddleware } from "./middleware/authmiddleware.js";
import { AnalystRole } from "./middleware/RoleMiddleware.js";
import FinanceRoutes from "./routes/firecords.js";

dotenv.config();
const app = Express();

app.use(Express.json());
app.use(cookieParser());

app.use("/api/auth", Authroutes);
app.use("/api/finance", FinanceRoutes);

app.get("/", Authmiddleware, AnalystRole, (req, res) => {});

app.listen(3000, () => {
  console.log(`Server Running On http://localhost:3000`);
});

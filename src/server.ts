import Express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import Authroutes from "./routes/Authroutes.js";
import jwt from "jsonwebtoken";
import { success } from "zod";
import { Authmiddleware } from "./middleware/authmiddleware.js";

dotenv.config();
const app = Express();

app.use(Express.json());
app.use(cookieParser());

app.use("/api/auth", Authroutes);

app.get("/", Authmiddleware, (req, res) => {
  try {
    const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.log("Jwt secret not defined");
      return new Error("Jwt secret not defined");
    }
    const token = req.cookies.token;

    const id = jwt.verify(token, JWT_SECRET);
    // @ts-ignore
    const userRole: string = req.userRole as string;
    const userId: string = req.userId as string;
    res.json(userRole + " " + userId);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log(`Server Running On http://localhost:3000`);
});

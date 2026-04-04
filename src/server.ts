import Express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import Authroutes from "./routes/Authroutes.js";

dotenv.config();
const app = Express();

app.use(Express.json());
app.use(cookieParser());

app.use("/api/auth", Authroutes);

app.listen(3000, () => {
  console.log(`Server Running On http://localhost:3000`);
});

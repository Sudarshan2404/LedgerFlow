import Express from "express";
import dotenv from "dotenv";
import { connectdb } from "./config/db.js";

dotenv.config();
const app = Express();
connectdb();

app.listen(3000, () => {
  console.log(`Server Running On http://localhost:3000`);
});

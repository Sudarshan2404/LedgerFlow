import Express from "express";
import dotenv from "dotenv";
import { Prisma } from "@prisma/client";

dotenv.config();
const app = Express();

app.listen(3000, () => {
  console.log(`Server Running On http://localhost:3000`);
});

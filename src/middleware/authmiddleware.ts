import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { Prisma, Role } from "@prisma/client";
import prisma from "../config/prisma.js";

declare global {
  namespace Express {
    interface Request {
      userRole?: Role;
      userId?: string;
    }
  }
}
export const Authmiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.log("Jwt secret not defined");
      return new Error("Jwt secret not defined");
    }
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "Please Login To continue" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const userId = decoded.id.id;
    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    const role = await prisma.user.findFirst({
      where: { id: userId },
      select: { role: true },
    });

    if (!role || !role.role) {
      return res.status(401).json({ message: "User role not found" });
    }

    const UserRole = role.role;
    req.userRole = UserRole;
    req.userId = userId;
    next();
  } catch (error) {
    console.log("Error occured in auth middleware", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

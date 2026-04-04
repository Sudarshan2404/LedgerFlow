import type { Request, Response, NextFunction } from "express";
import { success } from "zod";

export const AnalystRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userRole = req.userRole;

    if (!userRole) {
      return res
        .status(400)
        .json({ success: false, message: "User Role Not found" });
    }

    if (userRole != "ANALYST") {
      return res.status(402).json({
        success: false,
        message: "You are not authorized to perform this action",
      });

      next();
    }
  } catch (error) {
    console.error("an error occured in roles middleware", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const AdminRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userRole = req.userRole;

    if (!userRole) {
      return res
        .status(400)
        .json({ success: false, message: "User Role Not found" });
    }

    if (userRole != "ADMIN") {
      return res.status(402).json({
        success: false,
        message: "You are not authorized to perform this action",
      });

      next();
    }
  } catch (error) {
    console.error("an error occured in roles middleware", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

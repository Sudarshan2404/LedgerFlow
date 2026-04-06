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
      return res.status(401).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }
    next();
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
      return res.status(401).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }
    next();
  } catch (error) {
    console.error("an error occured in roles middleware", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const allowRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.userRole;

      if (!userRole) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: insufficient permissions",
        });
      }

      next(); // ✅ VERY IMPORTANT
    } catch (error) {
      console.error("Error in allowRoles middleware:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

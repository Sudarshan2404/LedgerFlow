import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import { success, type date } from "zod";

declare global {
  namespace Express {
    interface Request {
      user: { id: string };
    }
  }
}

export const addRecord = async (req: Request, res: Response) => {
  try {
    const { amount, type, category, notes } = req.body;
    const date: Date = new Date();

    if (type !== "income" && type !== "expense") {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Input type can either be income or expense",
      });
    }

    const id = req?.userId;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await prisma.records.create({
      data: {
        amount,
        type,
        category,
        date,
        notes,
        user: {
          connect: { id },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Record created successfully",
    });
  } catch (error) {
    console.error("An error occurred while creating a new record", error);
    res.status(500).json({ success: false, message: "Internal server Error" });
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  try {
    const { recordId, amount, type, category, notes } = req.body;
    const date = new Date();
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const record = await prisma.records.update({
      where: { id: recordId, userId },
      data: {
        amount,
        type,
        category,
        notes,
        date,
      },
    });

    if (record.userId != userId) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "This record cannot be updated as it is not associated with you",
        });
    }
    return res.status(200).json({
      success: true,
      message: "Record updated successfully",
    });
  } catch (error) {
    console.error("An error occurred while updating the record", error);
    res.status(500).json({ success: false, message: "Internal server Error" });
  }
};

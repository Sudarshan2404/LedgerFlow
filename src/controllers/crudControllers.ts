import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import { success, type date } from "zod";

export const addRecord = async (req: Request, res: Response) => {
  try {
    const { amount, type, category, date, note } = req.body;

    if (type != "income" || "expense") {
      return res.status(400).json({
        success: false,
        message: "invalid type inputs type can either be income or expense",
      });
    }
    const data: any = {
      amount,
      type,
      category,
      note,
    };

    if (date) {
      data.date = new Date(date);
    }

    prisma.records.create({ data });
  } catch (error) {
    console.error("An error occured while creating a new record");
    res
      .status(500)
      .json({ success: false, message: "Internel server Error" + error });
  }
};

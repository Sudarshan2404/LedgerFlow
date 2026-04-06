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

export const getAllRecords = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const records = await prisma.records.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching records:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRecordbyId = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide record id",
      });
    }

    const record = await prisma.records.findFirst({
      where: {
        id: id as string,
      },
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error fetching records:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

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

    if (!recordId) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter the record id" });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const existing = await prisma.records.findFirst({
      where: { id: recordId },
    });

    if (existing?.userId != userId) {
      return res.status(400).json({
        success: false,
        message:
          "This record cannot be updated as it is not associated with you",
      });
    }

    const record = await prisma.records.update({
      where: { id: recordId },
      data: {
        amount,
        type,
        category,
        notes,
        date,
        user: {
          connect: { id: userId },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Record updated successfully",
    });
  } catch (error) {
    console.error("An error occurred while updating the record", error);
    res.status(500).json({ success: false, message: "Internal server Error" });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { recordId } = req.body;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const existing = await prisma.records.findFirst({
      where: { id: recordId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: "recoed not found" });
    }

    if (existing?.userId != userId) {
      return res.status(400).json({
        success: false,
        message:
          "This record cannot be deleted as it is not associated with you",
      });
    }

    await prisma.records.delete({
      where: { id: recordId },
    });

    return res.status(200).json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.error("An error occurred while deleting the record", error);
    res.status(500).json({ success: false, message: "Internal server Error" });
  }
};

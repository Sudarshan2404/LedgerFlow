import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { email, number, parseAsync, success, z } from "zod";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";

const salt_rounds: number = Number(process.env.SALT_ROUNDS);

const registerSchema = z.object({
  email: z.email().toLowerCase(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be less than 20 characters" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[!@#$%^&*]/.test(val), {
      message: "Password must contain at least one special character",
    }),
  name: z.string().min(4).toLowerCase(),
});

const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be less than 20 characters" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[!@#$%^&*]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});

type registert = {
  email: string;
  name: string;
  password: string;
};

type logint = {
  email: string;
  password: string;
};

export const Login = async (req: Request, res: Response) => {
  try {
    const parse = registerSchema.safeParse(req.body);

    if (!parse.success) {
      return res.status(400).json({ success: false, message: parse.error });
    }

    const { email, name, password } = parse.data;
    const userExist = await prisma.user.findFirst({
      where: { email: email },
    });

    if (userExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }

    const hashedPass = await bcrypt.hash(password, salt_rounds);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPass,
        name,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "user created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Servor Error" });
  }
};

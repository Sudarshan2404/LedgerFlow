import type { Request, Response } from "express";
import { Prisma, type Role } from "@prisma/client";
import { email, number, parseAsync, success, z } from "zod";
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import { genreatetoken } from "../services/generateToken.js";

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
  id: string;
  email: string;
  password: string;
};

export const register = async (req: Request, res: Response) => {
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
    const userId: string = user.id as string;
    const token = genreatetoken({ id: userId });

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.DEVLOPMENT === "Production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ success: true, message: "user created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Servor Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const parse = loginSchema.safeParse(req.body);

  if (!parse.success) {
    return res.status(400).json({ success: false, message: parse.error });
  }
  const { email, password } = parse.data;
  const user: logint | null = await prisma.user.findFirst({
    where: { email: email },
    select: { id: true, email: true, password: true },
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "User does not exist" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }

  const userId: string = user.id as string;
  const token = genreatetoken({ id: userId });

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.DEVLOPMENT === "Production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ success: true, token });
};

export const changerole = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { role } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing user id" });
    }

    await prisma.user.update({
      where: { id },
      data: {
        role: role,
      },
    });

    res.status(200).json({
      success: true,
      message: `updated user with id: ${id} role to ${role} successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

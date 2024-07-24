import express, { Request, Response } from "express";
const userRoute = express.Router();
import zod, { string } from "zod";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { StringifyOptions } from "querystring";
import { log } from "console";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authMiddleware from "../authMiddlreware";

const prisma = new PrismaClient();
dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";

userRoute.get("/", (req, res) => {
  res.json({
    msg: "ho there",
  });
});

const zodSignupSchema = zod.object({
  username: zod.string(),
  email: zod.string().email(),
  password: zod.string().min(6),
});
const zodSigninSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
});
type SignupData = zod.infer<typeof zodSignupSchema>;

userRoute.post("/signup", async (req: Request, res: Response) => {
  let result = zodSignupSchema.safeParse(req.body);
  console.log(result.data);

  try {
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

    console.log({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const NewUser = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      },
      select: {
        id: true,
      },
    });
    if (NewUser) {
      const token = jwt.sign({ id: NewUser.id }, JWT_SECRET);
      const userId = NewUser.id;
      return res.json({
        jwt: token,
        userId,
      });
    }
  } catch (error) {
    console.log(`sign up  ${error}`);
    res.json({
      msg: error,
    });
  }
});
userRoute.post("/signin", async (req: Request, res: Response) => {
  try {
    let result = zodSigninSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

    const loginUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
        password: req.body.password,
      },
      select: {
        username: true,
        id: true,
      },
    });

    if (loginUser) {
      const token = jwt.sign({ id: loginUser.id }, JWT_SECRET);

      return res.json({
        jwt: token,
        username: loginUser.username,
      });
    }
  } catch (error) {
    console.log(`sign up  ${error}`);
    res.json({
      msg: error,
    });
  }
});
userRoute.get("/data", async (req: Request, res: Response) => {
  try {
    let result = zodSigninSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }

    console.log({
      email: req.body.email,
      password: req.body.password,
    });

    const loginUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
        password: req.body.password,
      },
    });
    if (loginUser) {
      const token = jwt.sign({ id: loginUser.id }, JWT_SECRET);
      res;
      return res.json({
        jwt: token,
      });
    }
  } catch (error) {
    console.log(`sign up  ${error}`);
    res.json({
      msg: error,
    });
  }
});

const zodUpdateSchema = zod.object({
  username: zod.string().optional(),
  password: zod.string().optional(),
});

userRoute.put(
  "/userupdate",
  authMiddleware,
  async (req: Request, res: Response) => {
    console.log("put");

    try {
      let validatedData = zodUpdateSchema.safeParse(req.body);

      if (!validatedData.success) {
        return res.status(400).json({ errors: validatedData.error.errors });
      }
      const authorId = req.userId;
      console.log(authorId, "put");
      const { username, password } = validatedData.data;
      interface userUpdateSchema {
        username?: string;
        password?: string;
      }

      const dataToUpdate: userUpdateSchema = {};
      if (username) dataToUpdate.username = username;
      if (password) dataToUpdate.password = password;
      console.log(dataToUpdate);

      const updatedUser = await prisma.user.update({
        where: {
          id: authorId,
        },
        data: dataToUpdate,
        select:{
          username:true,
          id:true
        }
      });
      if (updatedUser) {
        const token = jwt.sign({ id: updatedUser.id }, JWT_SECRET);
        res;
        return res.json({
          jwt: token,
          username
        });
      }
      return res.json({
        msg: "user Data is Update",
      });
    } catch (error) {
      console.log(`sign up  ${error}`);
      res.json({
        msg: error,
      });
    }
  }
);
export default userRoute;

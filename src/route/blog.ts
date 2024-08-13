import express, { Request, Response } from "express";
const blogRoute = express.Router()
import authMiddlareware from "../authMiddlreware/index"
import zod, { string } from 'zod'
import { title } from "process";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { log } from "console";
import { isBooleanObject } from "util/types";
import { PrismaClientRustPanicError } from "@prisma/client/runtime/library";
const prisma = new PrismaClient()
dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";
const blogZodSchema = zod.object({
    title: zod.string(),
    content: zod.string(),
    userId: zod.string()
})

blogRoute.post('/blog', authMiddlareware, async (req: Request, res: Response) => {

    const zodBlogValidate = blogZodSchema.safeParse(req.body)

    const authorId = req.userId
    console.log(authorId);

    try {
        await prisma.post.create({
            data: {
                title: req.body.title,
                authorId: `${authorId}`,
                content: req.body.content,
            }
            ,
            select: {
                author: true
                , id: true
            }
        })

        res.status(200).json({
            msg: "post is uploaded"
        })

    } catch (error) {
        console.log(`${error}`);

    }

})


blogRoute.put('/blog', authMiddlareware, async (req: Request, res: Response) => {
const blogUpdateZodSchema = zod.object({
    title:zod.string().optional(),
    content:zod.string().optional(),
})
    const zodBlogsValidate = blogUpdateZodSchema.safeParse(req.body)
    if (!zodBlogsValidate.success) {
        return res.status(400).json({ errors: zodBlogsValidate.error.errors });
      }
    const {title,content} = zodBlogsValidate.data
    interface userUpdateSchema {
        title?: string;
        content?: string;
      }

      const dataToUpdate: userUpdateSchema = {};
      if (title) dataToUpdate.title = title;
      if (content) dataToUpdate.content = content;
      console.log(dataToUpdate);
   const blogId = req.query.id

    try {
   const response = await prisma.post.update({
            where: {
                id: `${blogId}`,
            },
          
            data: {
                title: req.body.title,
                content: req.body.content
            },
            select:{
                title:true,
                content:true
            }
        })
        if (response) {


            res.status(200).json({
                msg: "post is update",
                response
            })
        }
    } catch (error) {
        console.log(`${error}`);

    }

})

blogRoute.get('/blog/all/a',(req,res)=>{
    res.json({
        msg:"asd da"
    })
})

blogRoute.get('/blog/all', async (req: Request, res: Response) => {

 

    try {
        const response = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        username: true,
                         id:true
                    }
                }
            }
        })

        if (response) {
            res.status(200).json({
                response
            })
            return response
        }
    } catch (error) {
        console.log(`${error}`);

    } finally {
        prisma.$disconnect()
    }

})

const readBlogZod  =  zod.string()


blogRoute.get('/blog', async (req: Request, res: Response) => {
    try {
        const validate = readBlogZod.safeParse(req.query.id)
        const blogId  = validate.data as string  
        const response = await prisma.post.findUnique(
            {
                where: {
                  id: blogId
                },
                include: {
                  author: {
                    select: {
                      username: true,
                      id:true
                    }
                  }
                }
              }
        )

        if (response) {
            res.status(200).json({
                response
            })
            return response
        }
    } catch (error) {
        console.log(`${error}`);

    } finally {
        prisma.$disconnect()
    }

})

//      this route will give u all user blog
blogRoute.get('/profile', async (req: Request, res: Response) => {
    const validate = readBlogZod.safeParse(req.query.userId)
    const userId  = validate.data as string  
    console.log(userId);
    
    try {
        const response = await prisma.post.findMany(
            {
                where: {
                  authorId: userId
                },
             include:{
                author:{
                    select:{
                        username:true,
                        id:true
                    }
                }
             }
            }
        )

        if (response) {
            res.status(200).json({
                response
            })
            return response
        }
    } catch (error) {
        console.log(`${error}`);

    } finally {
        prisma.$disconnect()
    }

})



blogRoute.delete('/blog/delete',authMiddlareware, async (req: Request, res: Response) => {

    const deleteBlogZod = zod.string()
    const validate = deleteBlogZod.safeParse(req.query.id)
    const blogId  = validate.data as string  
    console.log(blogId);
    
    try {
        const response = await prisma.post.delete(
            {
                where: {
                  id: blogId
                },
            }
        )

        if (response) {
            res.status(200).json({
                response,
                msg:"delete success"
            })
            return response
        }
    } catch (error) {
        console.log(`${error}`);

    } finally {
        prisma.$disconnect()
    }

})










blogRoute.get('/', (req, res) => {
    res.json({
        msg: "ho there"

    })
})


export default blogRoute
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogRoute = express_1.default.Router();
const index_1 = __importDefault(require("../authMiddlreware/index"));
const zod_1 = __importDefault(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const blogZodSchema = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string(),
    userId: zod_1.default.string()
});
blogRoute.post('/blog', index_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const zodBlogValidate = blogZodSchema.safeParse(req.body);
    const authorId = req.userId;
    console.log(authorId);
    try {
        yield prisma.post.create({
            data: {
                title: req.body.title,
                authorId: `${authorId}`,
                content: req.body.content,
            },
            select: {
                author: true,
                id: true
            }
        });
        res.status(200).json({
            msg: "post is uploaded"
        });
    }
    catch (error) {
        console.log(`${error}`);
    }
}));
blogRoute.put('/blog', index_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogUpdateZodSchema = zod_1.default.object({
        title: zod_1.default.string().optional(),
        content: zod_1.default.string().optional(),
    });
    const zodBlogsValidate = blogUpdateZodSchema.safeParse(req.body);
    if (!zodBlogsValidate.success) {
        return res.status(400).json({ errors: zodBlogsValidate.error.errors });
    }
    const { title, content } = zodBlogsValidate.data;
    const dataToUpdate = {};
    if (title)
        dataToUpdate.title = title;
    if (content)
        dataToUpdate.content = content;
    console.log(dataToUpdate);
    const blogId = req.query.id;
    try {
        const response = yield prisma.post.update({
            where: {
                id: `${blogId}`,
            },
            data: {
                title: req.body.title,
                content: req.body.content
            },
            select: {
                title: true,
                content: true
            }
        });
        if (response) {
            res.status(200).json({
                msg: "post is update",
                response
            });
        }
    }
    catch (error) {
        console.log(`${error}`);
    }
}));
blogRoute.get('/blog/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const zodBlogValidate = blogZodSchema.safeParse(req.body);
    console.log({
        title: req.body.title,
        content: req.body.content,
    });
    const authorId = req.userId;
    console.log(authorId);
    try {
        const response = yield prisma.post.findMany({
            include: {
                author: {
                    select: {
                        username: true,
                        id: true
                    }
                }
            }
        });
        if (response) {
            res.status(200).json({
                response
            });
            return response;
        }
    }
    catch (error) {
        console.log(`${error}`);
    }
    finally {
        prisma.$disconnect();
    }
}));
const readBlogZod = zod_1.default.string();
blogRoute.get('/blog', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validate = readBlogZod.safeParse(req.query.id);
        const blogId = validate.data;
        const response = yield prisma.post.findUnique({
            where: {
                id: blogId
            },
            include: {
                author: {
                    select: {
                        username: true,
                        id: true
                    }
                }
            }
        });
        if (response) {
            res.status(200).json({
                response
            });
            return response;
        }
    }
    catch (error) {
        console.log(`${error}`);
    }
    finally {
        prisma.$disconnect();
    }
}));
//      this route will give u all user blog
blogRoute.get('/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validate = readBlogZod.safeParse(req.query.userId);
    const userId = validate.data;
    console.log(userId);
    try {
        const response = yield prisma.post.findMany({
            where: {
                authorId: userId
            },
            include: {
                author: {
                    select: {
                        username: true,
                        id: true
                    }
                }
            }
        });
        if (response) {
            res.status(200).json({
                response
            });
            return response;
        }
    }
    catch (error) {
        console.log(`${error}`);
    }
    finally {
        prisma.$disconnect();
    }
}));
blogRoute.delete('/blog/delete', index_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteBlogZod = zod_1.default.string();
    const validate = deleteBlogZod.safeParse(req.query.id);
    const blogId = validate.data;
    console.log(blogId);
    try {
        const response = yield prisma.post.delete({
            where: {
                id: blogId
            },
        });
        if (response) {
            res.status(200).json({
                response,
                msg: "delete success"
            });
            return response;
        }
    }
    catch (error) {
        console.log(`${error}`);
    }
    finally {
        prisma.$disconnect();
    }
}));
blogRoute.get('/', (req, res) => {
    res.json({
        msg: "ho there"
    });
});
exports.default = blogRoute;

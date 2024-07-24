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
const userRoute = express_1.default.Router();
const zod_1 = __importDefault(require("zod"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const authMiddlreware_1 = __importDefault(require("../authMiddlreware"));
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
userRoute.get("/", (req, res) => {
    res.json({
        msg: "ho there",
    });
});
const zodSignupSchema = zod_1.default.object({
    username: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
const zodSigninSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
userRoute.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const NewUser = yield prisma.user.create({
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
            const token = jsonwebtoken_1.default.sign({ id: NewUser.id }, JWT_SECRET);
            const userId = NewUser.id;
            return res.json({
                jwt: token,
                userId,
            });
        }
    }
    catch (error) {
        console.log(`sign up  ${error}`);
        res.json({
            msg: error,
        });
    }
}));
userRoute.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = zodSigninSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.errors });
        }
        const loginUser = yield prisma.user.findUnique({
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
            const token = jsonwebtoken_1.default.sign({ id: loginUser.id }, JWT_SECRET);
            return res.json({
                jwt: token,
                username: loginUser.username,
            });
        }
    }
    catch (error) {
        console.log(`sign up  ${error}`);
        res.json({
            msg: error,
        });
    }
}));
userRoute.get("/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = zodSigninSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.errors });
        }
        console.log({
            email: req.body.email,
            password: req.body.password,
        });
        const loginUser = yield prisma.user.findUnique({
            where: {
                email: req.body.email,
                password: req.body.password,
            },
        });
        if (loginUser) {
            const token = jsonwebtoken_1.default.sign({ id: loginUser.id }, JWT_SECRET);
            res;
            return res.json({
                jwt: token,
            });
        }
    }
    catch (error) {
        console.log(`sign up  ${error}`);
        res.json({
            msg: error,
        });
    }
}));
const zodUpdateSchema = zod_1.default.object({
    username: zod_1.default.string().optional(),
    password: zod_1.default.string().optional(),
});
userRoute.put("/userupdate", authMiddlreware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("put");
    try {
        let validatedData = zodUpdateSchema.safeParse(req.body);
        if (!validatedData.success) {
            return res.status(400).json({ errors: validatedData.error.errors });
        }
        const authorId = req.userId;
        console.log(authorId, "put");
        const { username, password } = validatedData.data;
        const dataToUpdate = {};
        if (username)
            dataToUpdate.username = username;
        if (password)
            dataToUpdate.password = password;
        console.log(dataToUpdate);
        const updatedUser = yield prisma.user.update({
            where: {
                id: authorId,
            },
            data: dataToUpdate,
            select: {
                username: true,
                id: true
            }
        });
        if (updatedUser) {
            const token = jsonwebtoken_1.default.sign({ id: updatedUser.id }, JWT_SECRET);
            res;
            return res.json({
                jwt: token,
                username
            });
        }
        return res.json({
            msg: "user Data is Update",
        });
    }
    catch (error) {
        console.log(`sign up  ${error}`);
        res.json({
            msg: error,
        });
    }
}));
exports.default = userRoute;

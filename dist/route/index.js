"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user"));
const blog_1 = __importDefault(require("./blog"));
const mainRoute = express_1.default.Router();
mainRoute.use('/user', user_1.default);
mainRoute.use('/post', blog_1.default);
mainRoute.get('/', (req, res) => {
    res.json({
        msg: "fine !"
    });
});
exports.default = mainRoute;

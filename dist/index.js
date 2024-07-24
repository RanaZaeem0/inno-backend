"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_1 = __importDefault(require("./route"));
const cors = require('cors');
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(cors());
app.use('/api', route_1.default);
app.get('/', (req, res) => {
    res.json({
        username: "zain",
        email: "zain@gmail.com"
    });
});
app.listen(port, () => {
    console.log(`servesr is rungung on port ${port}`);
});

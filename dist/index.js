"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_1 = __importDefault(require("./route"));
const client_1 = require("@prisma/client");
const cors = require('cors');
const clinet = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(cors());
app.use('/api', route_1.default);
app.get('/', (req, res) => {
    res.json({
        username: "zain",
        email: "zain@gmail.com"
    });
});
clinet.$connect()
    .then(() => {
    console.log('Connected to PostgreSQL database');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
    .catch((error) => {
    console.error('Failed to connect to the database:', error);
});
app.listen(port, () => {
    console.log(`servesr is rungung on port ${port}`);
});

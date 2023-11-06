"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const add_account_1 = __importDefault(require("./routes/add_account"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use('/add/account', add_account_1.default);
app.get('/', (req, res) => {
    res.send('Hello, Express with TypeScript!');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

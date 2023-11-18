"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const mysql_1 = __importDefault(require("mysql"));
const config_1 = require("./lib/config");
const users_1 = __importDefault(require("./routes/users"));
// import accountAddFormRouter from './routes/add_account';
// import indexRouter from './routes/index';
const members_1 = __importDefault(require("./routes/members"));
const charge_item_1 = __importDefault(require("./routes/charge_item"));
const pool = mysql_1.default.createPool(config_1.mysql);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use((req, res, next) => {
    req.pool = pool;
    next();
});
// app.use('/', indexRouter);
app.use('/users', users_1.default);
app.use('/members', members_1.default);
app.use('/chargeitem', charge_item_1.default);
// app.use('/account/add', accountAddFormRouter);
exports.default = app;

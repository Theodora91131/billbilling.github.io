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
// routes/index.ts
const express_1 = __importDefault(require("express"));
const account_1 = require("./utility/account"); // 使用正确的相对路径
const router = express_1.default.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const accountData = yield (0, account_1.account_query)();
            // 在此处理 accountData，例如传递给视图
            res.render('index', { title: 'Express', accountData });
        }
        catch (error) {
            console.error('Error:', error);
            next(error);
        }
    });
});
module.exports = router;

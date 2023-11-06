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
exports.query = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
// Azure MySQL connection config
const config = {
    host: 'myway.mysql.database.azure.com',
    user: 'ntou',
    password: '01157CSEwork',
    database: 'account',
    port: 3306,
    ssl: {
        rejectUnauthorized: false
    }
};
// Create MySQL connection pool
const pool = promise_1.default.createPool(config);
pool.getConnection()
    .then((connection) => {
    console.log('MySQL connected successfully!');
    connection.release(); // Release the connection back to the pool
})
    .catch((err) => {
    console.error(err);
});
// Example async query
function query(sql, values = []) {
    return __awaiter(this, void 0, void 0, function* () {
        const [rows] = yield pool.execute(sql, values);
        return rows;
    });
}
exports.query = query;

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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// GET /income/:id - 根據 ID 取得單一項目
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = req.pool;
    const incomeId = req.params.id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        connection.query('SELECT * FROM income WHERE income_id = ?', [incomeId], (err, results) => {
            connection.release();
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            if (results.length === 0) {
                res.status(404).send('not found');
            }
            else {
                const member = results[0]; // 取第一筆資料
                res.json(member);
            }
        });
    });
}));
// GET /income - 取得所有項目
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = req.pool;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        connection.query('SELECT * FROM income', (err, members) => {
            connection.release();
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.json(members);
        });
    });
}));
// POST /income - 新增項目
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = req.pool;
    const newincome = req.body;
    if (!newincome || !newincome.incom_sorc_id || !newincome.member_id || !newincome.price || !newincome.date) {
        res.status(400).send('Bad Request: Invalid charge item data');
        return;
    }
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        // 使用占位符進行參數綁定
        connection.query('INSERT INTO income SET incom_sorc_id = ?, member_id = ?, price = ?, date = ? ', [newincome.incom_sorc_id, newincome.member_id, newincome.price, newincome.date], (err, result) => {
            connection.release();
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(201).json(Object.assign({ chage_item_id: result.insertId }, newincome));
        });
    });
}));
//PUT /income/:id - 更新項目
router.put('/:id', (req, res, next) => {
    const pool = req.pool;
    const incomeId = req.params.id;
    const updatedincome = req.body;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        connection.query('UPDATE income SET ? WHERE income_id = ?', [updatedincome, incomeId], (err) => {
            connection.release();
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(200).send('updated successfully');
        });
    });
});
// DELETE /income/:id - 刪除項目
router.delete('/:id', (req, res, next) => {
    const pool = req.pool;
    const incomeId = req.params.id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        connection.query('DELETE FROM income WHERE income_id = ?', [incomeId], (err) => {
            connection.release();
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(200).send('deleted successfully');
        });
    });
});
module.exports = router;

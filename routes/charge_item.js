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
// GET /charge_items/:id - 根據 ID 取得單一項目
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = req.pool;
    const itemId = req.params.id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        connection.query('SELECT charge_item.*, member.acc_name FROM charge_item INNER JOIN member ON charge_item.member_id = member.member_id WHERE charge_item.charge_item_id = ?', [itemId], (err, results) => {
            connection.release();
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            if (results.length === 0) {
                res.status(404).send('Member not found');
            }
            else {
                const member = results[0]; // 取第一筆資料
                res.json(member);
            }
        });
    });
}));
// GET /charge_items - 取得所有項目
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = req.pool;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        connection.query('SELECT * FROM charge_item', (err, members) => {
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
// POST /charge_items - 新增項目
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = req.pool;
    const newChargeItem = req.body;
    if (!newChargeItem || !newChargeItem.member_id || !newChargeItem.cItems_id || !newChargeItem.charge_name || !newChargeItem.price || !newChargeItem.date || !newChargeItem.chage_item_id) {
        res.status(400).send('Bad Request: Invalid charge item data');
        return;
    }
    try {
        const connection = yield pool.getConnection();
        // 使用占位符進行參數綁定
        const query = 'INSERT INTO charge_item SET ?';
        const [result] = yield connection.query(query, [newChargeItem]);
        connection.release();
        res.status(201).json(Object.assign({ charge_item_id: result.insertId }, newChargeItem));
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}));
// PUT /charge_items/:id - 更新項目
router.put('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = req.pool;
    const itemId = req.params.id;
    const updatedChargeItem = req.body;
    try {
        const connection = yield pool.getConnection();
        // 使用占位符進行參數綁定
        const query = 'UPDATE charge_item SET ? WHERE charge_item_id = ?';
        yield connection.query(query, [updatedChargeItem, itemId]);
        connection.release();
        res.status(200).send('Charge item updated successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}));
// DELETE /charge_items/:id - 刪除項目
router.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = req.pool;
    const itemId = req.params.id;
    try {
        const connection = yield pool.getConnection();
        // 使用占位符進行參數綁定
        const query = 'DELETE FROM charge_item WHERE charge_item_id = ?';
        yield connection.query(query, [itemId]);
        connection.release();
        res.status(200).send('Charge item deleted successfully');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}));
module.exports = router;

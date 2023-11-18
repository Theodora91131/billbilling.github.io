"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// GET /members/:id - 根據 ID 取得單一會員
router.get('/:id', (req, res, next) => {
    const pool = req.pool;
    const memberId = req.params.id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        connection.query('SELECT * FROM member WHERE member_id = ?', [memberId], (err, results) => {
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
});
// GET /members - 取得所有會員
router.get('/', (req, res, next) => {
    const pool = req.pool;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        connection.query('SELECT * FROM member', (err, members) => {
            connection.release();
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.json(members);
        });
    });
});
// POST /members - 新增會員
router.post('/', (req, res, next) => {
    const pool = req.pool;
    const newMember = req.body;
    if (!newMember || !newMember.acc_name || !newMember.password) {
        res.status(400).send('Bad Request: Invalid member data');
        return;
    }
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        // 使用占位符進行參數綁定
        connection.query('INSERT INTO member SET acc_name = ?, password = ?', [newMember.acc_name, newMember.password], (err, result) => {
            connection.release();
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(201).json(Object.assign({ member_id: result.insertId }, newMember));
        });
    });
});
// PUT /members/:id - 更新會員
router.put('/:id', (req, res, next) => {
    const pool = req.pool;
    const memberId = req.params.id;
    const updatedMember = req.body;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        connection.query('UPDATE member SET ? WHERE member_id = ?', [updatedMember, memberId], (err) => {
            connection.release();
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(200).send('Member updated successfully');
        });
    });
});
// DELETE /members/:id - 刪除會員
router.delete('/:id', (req, res, next) => {
    const pool = req.pool;
    const memberId = req.params.id;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        connection.query('DELETE FROM member WHERE member_id = ?', [memberId], (err) => {
            connection.release();
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(200).send('Member deleted successfully');
        });
    });
});
module.exports = router;

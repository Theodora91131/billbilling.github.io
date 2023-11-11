"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/* GET users listing. */
router.get('/', (req, res, next) => {
    const pool = req.pool; // Assuming 'pool' is added to the 'req' object
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('DB CONNECTING!');
        connection.query('SELECT * FROM member', (err, members) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            console.log('result :\n', members);
            res.json(members);
        });
    });
});
module.exports = router;

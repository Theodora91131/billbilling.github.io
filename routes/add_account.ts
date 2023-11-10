// add_account.ts
import express from 'express';
const router = express.Router();
import * as account from './utility/account';

// 接收 GET 请求
router.get('/', async (req, res, next) => {
    try {
        const data = await account.account_query();
        if (data) {
            res.send(data);
            console.log(data);
        } else {
            res.send('Data not found');
        }
    } catch (error) {
        console.error('Error:', error);
        res.send('An error occurred');
    }
});

// 匯出
export = router;

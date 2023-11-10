// routes/index.ts
import express, { Request, Response, NextFunction } from 'express';
import { account_query } from './utility/account'; // 使用正确的相对路径

const router = express.Router();

/* GET home page. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
    try {
        const accountData = await account_query();

        // 在此处理 accountData，例如传递给视图
        res.render('index', { title: 'Express', accountData });
    } catch (error) {
        console.error('Error:', error);
        next(error);
    }
});

export = router;

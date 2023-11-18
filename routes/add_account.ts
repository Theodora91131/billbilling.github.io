// // add_account.ts
// import express from 'express';
// const router = express.Router();
// import * as account from './utility/account';
// import { pool } from './utility/asyncDB';
// // 接收 GET 请求
// router.get('/', async (req, res, next) => {
//     try {
//         const connection = await pool.getConnection();
//         const [rows] = await connection.execute('SELECT * FROM account.member');
//         connection.release(); // Release the connection back to the pool
//         if (rows) {
//             res.send(rows);
//             console.log(rows);
//         } else {
//             res.send('Data not found');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.send('An error occurred');
//     }
// });

// // 匯出
// export = router;

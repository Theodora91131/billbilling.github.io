import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// GET /income/:id - 根據 ID 取得單一項目
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const incomeId = req.params.id;

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('SELECT * FROM income WHERE income_id = ?', [incomeId], (err: any, results: any) => {
            connection.release();

            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.length === 0) {
                res.status(404).send('not found');
            } else {
                const member = results[0]; // 取第一筆資料
                res.json(member);
            }
        });
    });
});

// GET /income - 取得所有項目
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('SELECT * FROM income', (err: any, members: any) => {
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


// POST /income - 新增項目
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const newincome = req.body;

    if (!newincome || !newincome.incom_sorc_id || !newincome.member_id || !newincome.price || !newincome.date) {
        res.status(400).send('Bad Request: Invalid charge item data');
        return;
    }

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // 使用占位符進行參數綁定
        connection.query('INSERT INTO income SET incom_sorc_id = ?, member_id = ?, price = ?, date = ? ', [newincome.incom_sorc_id, newincome.member_id, newincome.price, newincome.date], (err: any, result: any) => {
            connection.release();

            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.status(201).json({ chage_item_id: result.insertId, ...newincome });
        });
    });
});

//PUT /income/:id - 更新項目
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const incomeId = req.params.id;
    const updatedincome= req.body;


    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('UPDATE income SET ? WHERE income_id = ?', [updatedincome, incomeId], (err: any) => {
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
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const incomeId = req.params.id;

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('DELETE FROM income WHERE income_id = ?', [incomeId], (err: any) => {
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

export = router;

import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// GET /charge_items/:id - 根據 ID 取得單一項目
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const itemId = req.params.id;

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('SELECT * FROM charge_item WHERE charge_item_id = ?', [itemId], (err: any, results: any) => {
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

// GET /charge_items - 取得所有項目
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('SELECT * FROM charge_item', (err: any, members: any) => {
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


// POST /charge_items - 新增項目
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const newChargeItem = req.body;

    if (!newChargeItem || !newChargeItem.cItems_id || !newChargeItem.member_id || !newChargeItem.charge_name || !newChargeItem.price || !newChargeItem.date) {
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
        connection.query('INSERT INTO charge_item SET cItems_id = ?, member_id = ?, charge_name = ?, price = ?, date = ? ', [newChargeItem.cItems_id, newChargeItem.member_id, newChargeItem.charge_name, newChargeItem.price, newChargeItem.date], (err: any, result: any) => {
            connection.release();

            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.status(201).json({ chage_item_id: result.insertId, ...newChargeItem });
        });
    });
});

//PUT /charge_items/:id - 更新項目
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const itemId = req.params.id;
    const updatedChargeItem = req.body;


    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('UPDATE charge_item SET ? WHERE charge_item_id = ?', [updatedChargeItem, itemId], (err: any) => {
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


// DELETE /charge_items/:id - 刪除項目
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const itemId = req.params.id;

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('DELETE FROM charge_item WHERE charge_item_id = ?', [itemId], (err: any) => {
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

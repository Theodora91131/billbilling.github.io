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

        connection.query('SELECT charge_item.*, member.acc_name FROM charge_item INNER JOIN member ON charge_item.member_id = member.member_id WHERE charge_item.charge_item_id = ?', [itemId], (err: any, results: any) => {
            connection.release();

            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.length === 0) {
                res.status(404).send('Member not found');
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

    if (!newChargeItem || !newChargeItem.member_id || !newChargeItem.cItems_id || !newChargeItem.charge_name || !newChargeItem.price || !newChargeItem.date || !newChargeItem.chage_item_id) {
        res.status(400).send('Bad Request: Invalid charge item data');
        return;
    }

    try {
        const connection = await pool.getConnection();

        // 使用占位符進行參數綁定
        const query = 'INSERT INTO charge_item SET ?';
        const [result] = await connection.query(query, [newChargeItem]);

        connection.release();

        res.status(201).json({ charge_item_id: result.insertId, ...newChargeItem });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT /charge_items/:id - 更新項目
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const itemId = req.params.id;
    const updatedChargeItem = req.body;

    try {
        const connection = await pool.getConnection();

        // 使用占位符進行參數綁定
        const query = 'UPDATE charge_item SET ? WHERE charge_item_id = ?';
        await connection.query(query, [updatedChargeItem, itemId]);

        connection.release();

        res.status(200).send('Charge item updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE /charge_items/:id - 刪除項目
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const itemId = req.params.id;

    try {
        const connection = await pool.getConnection();

        // 使用占位符進行參數綁定
        const query = 'DELETE FROM charge_item WHERE charge_item_id = ?';
        await connection.query(query, [itemId]);

        connection.release();

        res.status(200).send('Charge item deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

export = router;

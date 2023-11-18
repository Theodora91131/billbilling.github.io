import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// GET /cItems/:id - 根據 ID 取得單一項目
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const cItemsId = req.params.id;

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('SELECT * FROM cItems WHERE cItems_id = ?', [cItemsId], (err: any, results: any) => {
            connection.release();

            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.length === 0) {
                res.status(404).send('Item not found');
            } else {
                const item = results[0]; // 取第一筆資料
                res.json(item);
            }
        });
    });
});

// GET /cItems - 取得所有項目
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('SELECT * FROM cItems', (err: any, items: any) => {
            connection.release();

            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.json(items);
        });
    });
});

// PUT /cItems/:id - 更新項目
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const cItemsId = req.params.id;
    const updatedItem = req.body;

    // 確保只有 cItems_name 可以修改
    if (!updatedItem || !updatedItem.cItems_name) {
        res.status(400).send('Bad Request: Invalid item data');
        return;
    }

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('UPDATE cItems SET cItems_name = ? WHERE cItems_id = ?', [updatedItem.cItems_name, cItemsId], (err: any) => {
            connection.release();

            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.status(200).send('Item updated successfully');
        });
    });
});

// POST /cItems - 新增消費類別
router.post('/', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const newItem = req.body;

    if (!newItem || !newItem.member_id || !newItem.cItems_name) {
        res.status(400).send('Bad Request: Invalid member data');
        return;
    }

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // 使用占位符進行參數綁定
        connection.query('INSERT INTO cItems SET member_id = ?, cItems_name = ?', [newItem.member_id, newItem.cItems_name], (err: any, result: any) => {
            connection.release();

            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.status(201).json({ cItems_id: result.insertId, ...newItem });
        });
    });
});
// DELETE /cItems/:id - 刪除消費類別
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const cItemsId = req.params.id;

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('DELETE FROM cItems WHERE cItems_id = ?', [cItemsId], (err: any) => {
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
export = router;

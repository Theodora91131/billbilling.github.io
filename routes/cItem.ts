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

        connection.query('SELECT * FROM cItem WHERE cItems_id = ?', [cItemsId], (err: any, results: any) => {
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

        connection.query('SELECT * FROM cItem', (err: any, items: any) => {
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

        connection.query('UPDATE cItem SET cItems_name = ? WHERE cItems_id = ?', [updatedItem.cItems_name, cItemsId], (err: any) => {
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

export = router;

import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();

// GET /incom_sorc/:id - 根據 ID 取得單一項目
router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const incomsorcId = req.params.id;

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('SELECT * FROM incom_sorc WHERE incom_sorc_id = ?', [incomsorcId], (err: any, results: any) => {
            connection.release();

            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (results.length === 0) {
                res.status(404).send('not found');
            } else {
                const item = results[0]; // 取第一筆資料
                res.json(item);
            }
        });
    });
});

// GET /incom_sorc - 取得所有項目
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('SELECT * FROM incom_sorc', (err: any, items: any) => {
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

// PUT /incom_sorc/:id - 更新項目
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const incomsorcId = req.params.id;
    const updatedIncomsorc = req.body;

    // 確保只有 incom_sorc 可以修改
    if (!updatedIncomsorc || !updatedIncomsorc.sorc_Items) {
        res.status(400).send('Bad Request: Invalid item data');
        return;
    }

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('UPDATE incom_sorc SET sorc_Items = ? WHERE incom_sorc_id = ?', [updatedIncomsorc.sorc_Items, incomsorcId], (err: any) => {
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

// POST /incom_sorc - 新增收益類別
router.post('/', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const newincom = req.body;

    if (!newincom || !newincom.member_id || !newincom.sorc_Items) {
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
        connection.query('INSERT INTO incom_sorc SET member_id = ?, sorc_Items = ?', [newincom.member_id, newincom.sorc_Items], (err: any, result: any) => {
            connection.release();

            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            res.status(201).json({ incom_sorc_id: result.insertId, ...newincom });
        });
    });
});
// DELETE /incom_sorc/:id - 刪除消費類別
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool;
    const incomsorcId = req.params.id;

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('DELETE FROM incom_sorc WHERE incom_sorc_id = ?', [incomsorcId], (err: any) => {
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

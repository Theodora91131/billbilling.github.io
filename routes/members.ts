import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();

/* GET users listing. */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    const pool = (req as any).pool; // Assuming 'pool' is added to the 'req' object

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('DB CONNECTING!');

        connection.query('SELECT * FROM member', (err: any, members: any) => {
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

export = router;

// app.ts
import createError from 'http-errors';
import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import mysql from 'mysql';
import { mysql as MySQLConfig } from './lib/config';
import usersRouter from './routes/users';
// import accountAddFormRouter from './routes/add_account';
// import indexRouter from './routes/index';
import membersRouter from './routes/members';
import chargeitemRouter from './routes/charge_item';
import cItemRouter from './routes/cItem';
import IncomsorcRouter from './routes/incom_sorc';
import Income from './routes/income';
const pool = mysql.createPool(MySQLConfig);
const app: Express = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req: Request, res: Response, next: NextFunction) => {
    (req as any).pool = pool;
    next();
});

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/members', membersRouter);
app.use('/chargeitem', chargeitemRouter);
app.use('/cItem', cItemRouter);
app.use('/Incomsorc', IncomsorcRouter);
app.use('/income', Income);
// app.use('/account/add', accountAddFormRouter);

export default app;

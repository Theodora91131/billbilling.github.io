import createError from 'http-errors';
import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'path';

import usersRouter from './routes/users';
import indexRouter from './routes/index';
//------------------------------------------------------------
// 增加引用模組
//------------------------------------------------------------
import accountAddFormRouter from './routes/add_account';

//------------------------------------------------------------

const app: Express = express();

// public engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
//-----------------------------------------
// 設定模組使用方式
//-----------------------------------------
app.use('/account/add', accountAddFormRouter);

//-----------------------------------------
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;

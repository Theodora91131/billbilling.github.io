import express from 'express';
import addAccountRouter from './routes/add_account'

const app = express();
const port = 3000;
app.use(express.json());
app.use('/add/account', addAccountRouter);
app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import { config } from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/router';

const app: Express = express();
const port = process.env.PORT || 5000;

config();

app.use(cors());
app.use(express.json());
app.use(morgan('short'));
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

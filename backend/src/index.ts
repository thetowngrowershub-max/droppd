import cors from 'cors';
import express from 'express';

import { env } from './env';
import { errorHandler } from './middleware/errorHandler';
import { accountRouter } from './routes/account';
import { authRouter } from './routes/auth';
import { devicesRouter } from './routes/devices';
import { ordersRouter } from './routes/orders';
import { walletRouter } from './routes/wallet';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRouter);
app.use('/account', accountRouter);
app.use('/wallet', walletRouter);
app.use('/orders', ordersRouter);
app.use('/devices', devicesRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`droppd backend listening on http://localhost:${env.PORT}`);
});

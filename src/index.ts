import 'dotenv/config';
import express, { type Request, type Response } from 'express';

export const app = express();

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export const startServer = (): void => {
  const port: number = Number(process.env.PORT ?? 3000);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();

import express from 'express';
import dotenv from 'dotenv';
import { listenForAuctionEnded } from './events/auctionEndedListener';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (_req, res) => res.send('Orchestrator Service Running'));

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Orchestrator Service running on port ${PORT}`);
  listenForAuctionEnded();
});
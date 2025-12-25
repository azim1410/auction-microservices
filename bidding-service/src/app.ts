import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database';
import bidRoutes from './routes/bidRoutes';
import { listenForAuctionEnded } from './events/auctionEndedListener';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/bids', bidRoutes);

app.get('/', (_req, res) => res.send('Bidding Service Running'));

const PORT = process.env.PORT || 3003;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Bidding Service running on port ${PORT}`);
    // Start listening for auction ended events
    listenForAuctionEnded();
  });
});
import { Router } from "express";
import {
  create,
  list,
  endAuctionController,
} from "../controllers/auctionController";
import itemRoutes from "./itemRoutes";
import { authorize } from "../middlewares/authorize";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import { rateLimiter } from "../middlewares/rateLimiter";

const router = Router();

router.use("/", itemRoutes);

router.post(
  "/",
  rateLimiter,
  authenticateJWT,
  authorize("seller", "admin"),
  create
);

/**
 * @openapi
 * /api/auctions:
 *   get:
 *     summary: Get a paginated list of auctions
 *     tags:
 *       - Auctions
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number default 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page default 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by auction status (e.g., active, ended)
 *     responses:
 *       200:
 *         description: List of auctions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 auctions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Auction'
 */
router.get("/", list);

router.post(
  "/:id/end",
  authenticateJWT,
  authorize("seller", "admin"),
  endAuctionController
);


export default router;

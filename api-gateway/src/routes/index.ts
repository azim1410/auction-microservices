import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { getServiceUrl } from '../consul';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

const serviceMap: Record<string, { name: string; auth: boolean }> = {
  users: { name: 'user-service', auth: false },
  auctions: { name: 'auction-service', auth: true },
  bids: { name: 'bidding-service', auth: true },
};

router.use('/api/:service/*', async (req, res, next) => {
  const service = req.params.service;
  const config = serviceMap[service];
  if (!config) return res.status(404).json({ message: 'Service not found' });

  // Auth if required
  if (config.auth) {
    authenticateJWT(req, res, async () => {
      await proxyToService(config.name, req, res, next);
    });
  } else {
    await proxyToService(config.name, req, res, next);
  }
});

const proxyToService = async (
  serviceName: string,
  req: any,
  res: any,
  next: any
) => {
  const target = await getServiceUrl(serviceName);
  if (!target) return res.status(503).json({ message: `${serviceName} unavailable` });
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => path.replace(/^\/api\/[^/]+/, '') || '/',
  })(req, res, next);
};

export default router;
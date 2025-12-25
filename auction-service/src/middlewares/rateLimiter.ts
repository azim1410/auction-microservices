import { Request, Response, NextFunction } from "express";

const windowMs = 15 * 60 * 1000;
const maxRequests = 100;

interface RateLimitInfo {
  count: number;
  startTime: number;
}

const ipRateLimits = new Map<string, RateLimitInfo>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip;
  const now = Date.now();

  // @ts-expect-error
  let rateInfo = ipRateLimits.get(ip);

  if (!rateInfo) {
    rateInfo = { count: 1, startTime: now };
    // @ts-expect-error
    ipRateLimits.set(ip, rateInfo);
    return next();
  }

  if (now - rateInfo.startTime > windowMs) {
    // Reset window
    rateInfo.count = 1;
    rateInfo.startTime = now;
    return next();
  }

  if (rateInfo.count < maxRequests) {
    rateInfo.count += 1;
    return next();
  }

  res
    .status(429)
    .json({ message: "Too many requests, please try again later." });
}

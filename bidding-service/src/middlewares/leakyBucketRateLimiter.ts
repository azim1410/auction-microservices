import { Request, Response, NextFunction } from "express";

// How Leaky Bucket Works
// Imagine a bucket with a hole: requests are added to the bucket, and they “leak out” (are processed) at a fixed rate.
// If the bucket is full (too many requests in a short time), new requests are rejected (or delayed, but we’ll reject for simplicity).
// This smooths out bursts and enforces a maximum average rate.

// Configurable values
const BUCKET_CAPACITY = 20; // Max burst size
const LEAK_RATE = 1; // Requests per second

interface Bucket {
  tokens: number;
  lastChecked: number;
}

const buckets = new Map<string, Bucket>();

export function leakyBucketRateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const key = req.ip;
  const now = Date.now();

  // @ts-expect-error
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { tokens: 0, lastChecked: now };
    //@ts-expect-error
    buckets.set(key, bucket);
  }

  /*
  Logic:

  IP1 sends 1 req, added to the bucket, will be served 1 req per sec.
  IP1 sends 25 req 20 will be added and the others will be ignored, and will process 1 req per sec.

  Results when tested : -
    Rate Limit Test Results - "place a bid" Endpoint
    Test Configuration:

    Total Requests: 100
    Delay: 0ms (maximum speed)
    Total Execution Time: ~429ms
    📊 Response Code Distribution
    Status Code	Count	Percentage	Description
    201 Created	20	20%	✅ Successful bids
    429 Too Many Requests	80	80%	🚫 Rate limited
    ⚡ Performance Metrics
    Response Times:

    First request: 152ms
    Subsequent 201 responses: 2-5ms (avg ~3ms)
    429 responses: 2-7ms (avg ~2.5ms)
    Rate Limiting Behavior:

    ✅ Requests 0-19: All succeeded (201 Created)
    🚫 Requests 20-99: All rate limited (429 Too Many Requests)

  */

  // Calculate how many tokens have leaked out since last check
  const elapsed = (now - bucket.lastChecked) / 1000; // seconds
  const leaked = Math.floor(elapsed * LEAK_RATE);
  bucket.tokens = Math.max(0, bucket.tokens - leaked);
  bucket.lastChecked = now;

  if (bucket.tokens < BUCKET_CAPACITY) {
    bucket.tokens += 1; // Add a token for this request
    next();
  } else {
    res
      .status(429)
      .json({ message: "Too many requests, please try again later." });
  }
}

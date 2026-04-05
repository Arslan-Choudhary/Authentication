import { rateLimit } from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 10,
  message: {
    message: "Too many requests. Please try again after 5 minute.",
  },
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});

export default rateLimiter;

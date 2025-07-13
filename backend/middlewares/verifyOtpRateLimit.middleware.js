import { redis } from "../config/redis.js";

export const verifyOtpRateLimit = async (req, res, next) => {
    
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(401).json({
                success : false,
                message : "Unauthorized !"
            });
        }

        const attemptsKey = `rateLimit:${email}`;
        const attempts = await redis.incr(attemptsKey);
        
        if (attempts === 1) {
            // First attempt, setting expiration to 1 hour (3600 seconds)
            await redis.expire(attemptsKey, 3600);
        }
        if (attempts > 5) {
            return res.status(429).json({
                success : false,
                message : "Too many requests, try again later."
            });
        }

        // If the user is within the limits then proceed to the the route handler
        next();

    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Internal server error."
        });
    }
}

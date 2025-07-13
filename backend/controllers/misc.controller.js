import { redis } from "../config/redis.js";

const CACHE_KEY="landingPageData";

export const getLandingPageData = async (req, res) => {
    try {
        const cached = await redis.get(CACHE_KEY);
        if (cached) {
            return res.status(200).json({
                success: true,
                data: JSON.parse(cached),
                cached: true
            });
        }
        return res.status(503).json({
            success: false,
            message: "Data is loading. Please try again shortly."
        });
    } catch (err) {
        console.error("Landing page fetch error:", err);
        return res.status(500).json({
            success: false,
            message: err.toString()
        });
    }
}
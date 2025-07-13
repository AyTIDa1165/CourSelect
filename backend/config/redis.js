import { Redis } from "ioredis";

const RETRY_DELAY=5000;

// Exporting the main redis client
export const redis = new Redis({
    host : process.env.REDIS_URL,
    port : process.env.REDIS_PORT,
    password : process.env.REDIS_PASSWORD,

    retryStrategy: (times) => {
        const delay = Math.min(times * 500, RETRY_DELAY);

        console.log(`Redis connection failed, retrying attempt ${times} in ${delay/1000}s ...`);

        return delay;
    },
});

export const checkRedisConnection = async () => {
    try {
        await new Promise((resolve, reject) => {
    
            if(redis.status === 'ready') {
                console.log(`..... Connected to Redis .....`);
                resolve();
                return;            
            }
    
            redis.on('ready', () => {
                console.log(`..... Connected to Redis .....`);
                resolve();
            });
    
            redis.on('error', (err) => {
                console.log(`Redis connection error : `, err);
                reject(err);
            });
            
        });
    }
    catch (error) {
        console.log(`Failed to connect to Redis : ${error.message}`);
    }
}

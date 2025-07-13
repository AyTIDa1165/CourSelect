import cron from "node-cron";
import { cacheLandingData } from "./cacheLandingData.js";

cron.schedule("0 */3 * * *", () => {
    console.log("Refreshing landing data cache...");
    cacheLandingData();
})

cacheLandingData();
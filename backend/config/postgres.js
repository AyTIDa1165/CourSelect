import prisma from "../prisma/index.js";

const RETRY_DELAY = 5000; // Time (in ms) after which the backend attempts to retry connecting after failing.

export const checkDBConnection = async () => {
    try{
        await prisma.$connect();
        console.log(`........ DB Connected ........`);
    } catch(error){
        console.error(`Failed to connect to the database: ${error.message}`);
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        setTimeout(checkDBConnection, RETRY_DELAY);
    }
};
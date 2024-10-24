import { createClient } from 'redis';

function createRedisConnection() {
    try {
        const client = createClient();
        client.connect();
        console.log("Successfully connected to Redis");
        return client;
    } catch (error) {
        console.log("Error connecting to Redis ", error);
        return null;
    }
}

export default createRedisConnection;

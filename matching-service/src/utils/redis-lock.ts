import { promisify } from 'util';
import redisClient from './redis-client';

const LOCK_KEY = 'matching_lock';
const LOCK_TIMEOUT = 5000; // 5 seconds

export async function acquireLock(): Promise<boolean> {
    const setAsync = promisify(redisClient.set).bind(redisClient);
    const result = await setAsync(LOCK_KEY, 'locked', 'NX', 'PX', LOCK_TIMEOUT);
    return result === 'OK';
}

export async function releaseLock(): Promise<void> {
    const delAsync = promisify(redisClient.del).bind(redisClient);
    await delAsync(LOCK_KEY);
}

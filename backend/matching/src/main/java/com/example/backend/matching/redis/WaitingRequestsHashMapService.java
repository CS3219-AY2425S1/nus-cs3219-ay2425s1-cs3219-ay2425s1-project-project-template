package com.example.backend.matching.redis;

import org.springframework.stereotype.Service;

import redis.clients.jedis.Jedis;

@Service
public class WaitingRequestsHashMapService {
    private Jedis jedis;
    private final String WAITING_MATCH_REQUESTS = "WaitingMatchRequests";

    public WaitingRequestsHashMapService(Jedis jedis) {
        this.jedis = jedis;
    }

    public void addWaitingRequest(String matchCriteriaKey, String matchRequestValue) {
        jedis.hset(WAITING_MATCH_REQUESTS, matchCriteriaKey, matchRequestValue);
    }

    public String getAndRemoveWaitingRequest(String matchCriteriaKey) {
        // Retrieve the value for the key
        String value = jedis.hget(WAITING_MATCH_REQUESTS, matchCriteriaKey);

        // Remove the key from the hash map if it exists
        if (value != null) {
            jedis.hdel(WAITING_MATCH_REQUESTS, matchCriteriaKey);
        }

        // Return the retrieved value
        return value;
    }
    
    public String getWaitingRequest(String matchCriteriaKey) {
        return jedis.hget(WAITING_MATCH_REQUESTS, matchCriteriaKey);
    }

    public boolean containsWaitingRequest(String matchCriteriaKey) {
        return jedis.hexists(WAITING_MATCH_REQUESTS, matchCriteriaKey);
    }
}

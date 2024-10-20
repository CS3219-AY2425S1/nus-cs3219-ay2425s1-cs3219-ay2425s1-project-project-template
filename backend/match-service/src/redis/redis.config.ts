export const REDIS_CONFIG = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  keys: {
    matchRequests: 'match_requests', // Sorted set for match requests
    matchDetails: 'match_details:', // Hash prefix for storing match details
    userMatches: 'user_matches:', // Hash prefix for storing user match status
  },
};
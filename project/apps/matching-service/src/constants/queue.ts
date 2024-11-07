export const MATCH_QUEUE = 'match_queue';
export const MATCH_EXPIRY_QUEUE = 'match_expiry_queue';
export const MATCH_EXPIRY_ROUTING_KEY = 'match_expiry_routing_key';

export const MATCH_TIMEOUT = 120000; // In milliseconds
export const MATCH_CANCEL_TTL = 120; // In seconds
export const MATCH_REQUEST_TTL = 121; // +1 second to ensure the match request expires only after timeout

// Note: used to limit the number of matches fetched using zrange
export const MATCH_FETCH_LIMIT = 10;

export const DIFFICULTY_QUEUE = "DIFFICULTY_QUEUE";
export const DIFFICULTY_ROUTING_KEY = "difficulty";
export const EXCHANGE = "difficulty_exchange"
export const HARD_ROUTING_KEY = "hard_queue";
export const MEDIUM_ROUTING_KEY = "medium_queue";
export const EASY_ROUTING_KEY = "easy_queue";
export const HARD = "Hard";
export const MEDIUM = "Medium";
export const EASY = "Easy";
export const DIFFICULTY_ROUTING_KEYS = [HARD_ROUTING_KEY, MEDIUM_ROUTING_KEY, EASY_ROUTING_KEY]
export const DIFFICULTY_ROUTING_MAPPING = {
    [HARD_ROUTING_KEY]: HARD,
    [MEDIUM_ROUTING_KEY]: MEDIUM,
    [EASY_ROUTING_KEY]: EASY
}
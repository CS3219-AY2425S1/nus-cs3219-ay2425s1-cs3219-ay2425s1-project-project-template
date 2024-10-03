-- Get all user IDs in the search pool
local userIds = redis.call('SMEMBERS', 'searchPool')

-- Iterate through all users in the search pool
for i, userId in ipairs(userIds) do
    -- Get the user's data
    local user = redis.call('HGETALL', 'user:' .. userId)
    local socketId = user[2]
    local criteria = cjson.decode(user[4])

    -- Check if the criteria matches
    if criteria.topic == ARGV[1] and criteria.difficulty == ARGV[2] then
        -- If a match is found, remove both users from the search pool
        redis.call('SREM', 'searchPool', userId)
        redis.call('DEL', 'user:' .. userId)

        -- Return matched user data (match found)
        return cjson.encode({
            matchedUsers = {
                { userId = userId, socketId = socketId, criteria = criteria },
                { userId = ARGV[3], socketId = ARGV[4], criteria = { topic = ARGV[1], difficulty = ARGV[2] } }
            }
        })
    end
end

-- If no match is found, add the current user to the search pool
redis.call('HSET', 'user:' .. ARGV[3], 'socketId', ARGV[4], 'criteria', cjson.encode({ topic = ARGV[1], difficulty = ARGV[2] }), 'startTime', ARGV[5])
redis.call('SADD', 'searchPool', ARGV[3])

-- Return nil (no match found)
return nil

import crypto from "crypto"
import { UserData } from "./types"

export const getRandomIntegerInclusive = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const deepEqual = (x, y) => {
    return (x && y && typeof x === 'object' && typeof y === 'object') ?
      (Object.keys(x).length === Object.keys(y).length) &&
        Object.keys(x).reduce(function(isEqual, key) {
          return isEqual && deepEqual(x[key], y[key]);
        }, true) : (x === y);
  }

export const generateSessionId = (user1Id: UserData, user2Id: UserData) => {
  const combinedId = [user1Id.user_id, user2Id.user_id].sort().join('-')
  console.log(combinedId)
  const sessionId = crypto.createHash('sha256').update(combinedId).digest('hex')
  return sessionId
}
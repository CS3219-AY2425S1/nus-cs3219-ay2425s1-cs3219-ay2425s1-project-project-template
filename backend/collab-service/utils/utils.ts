import { createHash } from "crypto"

const createRoomId = (userId1: string, userId2: string) => {
    const roomId = userId1 < userId2 ? `${userId1}-${userId2}` : `${userId2}-${userId1}`
    const hash = createHash('sha256').update(roomId).digest('hex')
    return hash
}

export { createRoomId }
import { Request } from 'express';

interface CreateRoomRequestBody {
    user1: string;
    user2: string;
}

export async function create_room(req: Request<{}, {}, CreateRoomRequestBody>, res) {
    // this function is to create a connection between two users
    // the connection is store in mongodb

    const { user1, user2 } = req.body;

}
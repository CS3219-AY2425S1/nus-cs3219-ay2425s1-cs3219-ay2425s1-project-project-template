import { connect } from 'mongoose';
import UsersSession from './usersSession-model';
import mongoose from 'mongoose';

export async function connectToMongo() {
    await connect('mongodb+srv://admin:admin_g50_password@cs3219-g50-question-ser.c7loi.mongodb.net/');
}

export async function createRoom(user1, user2, roomId) {
    try {
        const newRoom = new UsersSession({
            users: [user1, user2],
            roomId: roomId,
            lastUpdated: new Date()
        });

        const savedRoom = await newRoom.save();
        return savedRoom;
    } catch (error) {
        console.error('Error creating room:', error);
        return null;
    }
}

export async function get_roomID(user) {
    try {
        const room = await UsersSession.findOne({ users: user });
        return room;
    } catch (error) {
        console.error('Error finding room for ${user}:', error);
        return null;
    }
}
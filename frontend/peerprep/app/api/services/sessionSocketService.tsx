import io from 'socket.io-client';
import { getAccessToken } from '../auth/actions';   

const token = async () => {
    const token = await getAccessToken();

    if (!token) {
        console.error('Access token not found');
        return;
    }
    return token;
};

export const socket =  io('http://localhost:8010', { auth: { token } });

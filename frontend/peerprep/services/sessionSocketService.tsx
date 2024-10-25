import io from 'socket.io-client';
import { getAccessToken } from '../auth/actions';

const getToken = async () => {
	const token = await getAccessToken();

	if (!token) {
		console.error('Access token not found');
		return null;
	}
	return token;
};

const initializeSocket = async () => {
	const token = await getToken();
	if (!token) return;

	const socket = io('http://localhost:8010', {
		auth: { token },
		transports: ['websocket'],
		reconnectionAttempts: 5,
		timeout: 20000,
	});

	return socket;
};

export const socket = initializeSocket();
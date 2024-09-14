import {Server, Socket} from 'socket.io';

export function handleEditorChanges(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('a user connected');
        
        socket.on('edit', (content) => {
            io.emit('updateContent', content);
        });
        
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};

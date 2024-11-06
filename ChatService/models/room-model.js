class Room {
    constructor(roomId, user1Id, user2Id) {
        this.roomId = roomId;
        this.users = [user1Id, user2Id]; 
        this.documentContent = ''; 
    }

    updateContent(content) {
        this.documentContent = content;
    }

    getRoomState() {
        return {
            roomId: this.roomId,
            users: this.users,
            documentContent: this.documentContent,
        };
    }
}

export default Room;

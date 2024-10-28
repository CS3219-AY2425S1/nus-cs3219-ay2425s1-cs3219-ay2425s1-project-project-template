export const decodeRoom = (roomID: string) => {
    const users: Array<string> = [];
    let beforeHash : Array<string> = [];
    for (let i = 0; i < roomID.length; i++) {
      if (roomID.charAt(i) === '#') {
        let strlen = +beforeHash.join("");
        let user = [];
        for (let j = 0; j < strlen; j++) {
          user.push(roomID.charAt(i + j + 1));
        }
        users.push(user.join(""));
        i += strlen;
        beforeHash = [];
      }
      else {
        beforeHash.push(roomID.charAt(i));
      }
    }
    return users;
}
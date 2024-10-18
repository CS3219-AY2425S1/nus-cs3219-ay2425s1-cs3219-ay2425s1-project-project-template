import { IMatch, IMatchRequest, IQueue } from "./queue";
import { createRoom } from "./room";

export interface INotifier {
  notify(success: boolean, usermame: string, roomId: string): void;
}

export class Matcher {
  private readonly interval: number = 1000; // In milliseconds
  private queue: IQueue;
  private notifer: INotifier;
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(queue: IQueue, notifier: INotifier) {
    this.queue = queue;
    this.notifer = notifier;
  }

  public match() {
    const map = this.queue.getRequests();
    console.log("Matching users...");
    console.log("Removing expired requests...");
    // Remove expired requests
    const { expired } = this.removeExpiredRequests(map);

    console.log("Notifying expired requests...");
    // Remove expired requests from queue
    expired.forEach((request) => {
      this.queue.cancel(request);
      this.notifer.notify(false, request.username, "");
    });

    console.log("Matching users by topic and difficulty...");
    // Match users by topic and difficulty
    const rooms = this.matchUsers(map);

    console.log("Notifying users of match...");
    // Notify users of match
    rooms.forEach((room) => {
      room.usernames.forEach((username) =>
        this.notifer.notify(true, username, room.roomId)
      );
    });
    //TODO: Create rooms in database

    if (!this.queue.getLength()) {
      console.log("Queue is empty, stopping matcher...");
      return;
    }

    console.log("Setting timeout for next match...");
    this.timeoutId = setTimeout(() => this.match(), this.interval);
  }

  private removeExpiredRequests(requestMap: Map<string, IMatchRequest[]>): {
    expired: IMatchRequest[];
  } {
    const expired: IMatchRequest[] = [];
    const now = Date.now();
    console.log("now:", now);

    requestMap.forEach((requests, key, map) => {
      requests.forEach((request) => {
        console.log(request.timestamp);
        if (request.timestamp < now - 30 * 1000) {
          expired.push(request);
          map.get(key)?.filter((x) => x == request);
        }
      });
    });

    return { expired };
  }

  private async matchUsers(
    requestMap: Map<string, IMatchRequest[]>
  ): Promise<IMatch[]> {
    let rooms = [];
    for (let key of Array.from(requestMap.keys())) {
      const requests = requestMap.get(key);
      if (!requests || requests.length < 2) {
        continue;
      }

      while (requests.length >= 2) {
        const users = requests.splice(0, 2);

        if (users.length != 2) {
          continue;
        }

        // Create Room and place users inside
        const user1 = users[0];
        const user2 = users[1];
        const room = await this.createRoom(user1, user2);
        rooms.push(room);

        // Remove users from queue
        this.queue.cancel({ username: user1.username });
        this.queue.cancel({ username: user2.username });
      }
    }

    return rooms;
  }

  private async createRoom(
    user1: IMatchRequest,
    user2: IMatchRequest
  ): Promise<IMatch> {
    // Match user1 and user2
    let users = [user1.username, user2.username];
    let room = await createRoom(user1.topic, user1.difficulty, users);
    if (room) {
      console.log(`Match Found, Forwarding to room${room._id.toString()}`);
      return {
        roomId: room._id.toString(),
        usernames: room.users,
        topic: room.topic,
        difficulty: room.difficulty,
      };
    }
    throw Error("Invalid Room");
  }

  public start() {
    if (this.timeoutId === null) {
      this.match();
    }
  }

  public stop() {
    clearTimeout(this.timeoutId as NodeJS.Timeout);
    this.timeoutId = null;
  }
}

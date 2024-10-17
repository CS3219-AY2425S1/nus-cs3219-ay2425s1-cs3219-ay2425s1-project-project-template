import { IMatch, IMatchRequest, IQueue } from "./queue";
import { createRoom } from "./room";

export interface INotifier {
  notify(success: boolean, usermame: string, roomId: string): void;
}

export class Matcher {
  private readonly shortInterval: number = 500; // In milliseconds
  private readonly longInterval: number = 2000; // In milliseconds
  private queue: IQueue;
  private notifer: INotifier;
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(queue: IQueue, notifier: INotifier) {
    this.queue = queue;
    this.notifer = notifier;
  }

  public match(queue: IQueue, notifier: INotifier) {
    this.queue.getRequests().then(async (requests) => {
      console.log("Matching users...");
      console.log("Removing expired requests...");
      // Remove expired requests

      console.log("Num requests:", requests.length);
      const { expired, valid } = this.checkExpiredRequests(requests);

      console.log("Notifying expired requests...");
      // Remove expired requests from queue
      expired.forEach((request) => {
        this.queue.cancel(request);
        this.notifer.notify(false, request.username, "");
      });

      if (valid.length < 2) {
        console.log(
          "Not enough requests to match. Switching to long interval..."
        );
        this.timeoutId = setTimeout(
          () => this.match(queue, notifier),
          this.longInterval
        );
        return;
      }

      console.log("Splitting requests by topic and difficulty...");
      // If requests not split by topic and difficulty, split them
      const requestMap = this.splitRequests(valid);

      console.log("Matching users by topic and difficulty...");
      // Match users by topic and difficulty
      const rooms = await this.matchUsers(requestMap);

      console.log("Notifying users of match...");
      // Notify users of match
      rooms.forEach((room) => {
        room.usernames.forEach((username) =>
          this.notifer.notify(true, username, room.roomId)
        );
      });

      //TODO: Create rooms in database

      console.log("Setting timeout for next match...");
      this.timeoutId = setTimeout(
        () => this.match(queue, notifier),
        this.shortInterval
      );
    });
  }

  private checkExpiredRequests(requests: IMatchRequest[]): {
    expired: IMatchRequest[];
    valid: IMatchRequest[];
  } {
    const expired: IMatchRequest[] = [];
    const valid: IMatchRequest[] = [];
    const now = Date.now();
    console.log("now:", now);

    requests.forEach((request) => {
      console.log(request.timestamp);
      if (request.timestamp < now - 30 * 1000) {
        expired.push(request);
      } else {
        valid.push(request);
      }
    });

    return { expired, valid };
  }

  private splitRequests(
    requests: IMatchRequest[]
  ): Map<string, IMatchRequest[]> {
    let map = new Map<string, IMatchRequest[]>();
    requests.forEach((request) => {
      const key = `${request.topic}-${request.difficulty}`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)?.push(request);
    });

    return map;
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
      this.match(this.queue, this.notifer);
    }
  }

  public stop() {
    clearTimeout(this.timeoutId as NodeJS.Timeout);
    this.timeoutId = null;
  }
}

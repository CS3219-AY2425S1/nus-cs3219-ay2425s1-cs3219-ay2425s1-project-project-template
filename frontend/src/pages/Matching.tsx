// Matching.tsx
import React, { useEffect, useState } from 'react';
import { connect } from 'amqplib';

// Define types for messages
interface SearchMessage {
  userId: string;
  difficulty: string;
  topics: string;
}

interface MatchMessage {
  userId: string;
  matchUserId: string;
}

const Matching: React.FC = () => {
  const [difficulty, setDifficulty] = useState<string>('');
  const [topics, setTopics] = useState<string>('');
  const [userId] = useState<string>(`user_${Math.random().toString(36).substring(2, 15)}`);
  const [searching, setSearching] = useState<boolean>(false);
  const [match, setMatch] = useState<string | null>(null);

  useEffect(() => {
    const listenForMatches = async () => {
      const connection = await connect('amqp://user:password@rabbitmq:5672/');
      const channel = await connection.createChannel();
      
      await channel.assertQueue('match_found_queue');

      channel.consume('match_found_queue', (msg) => {
        if (msg) {
          const matchMessage: MatchMessage = JSON.parse(msg.content.toString());
          if (matchMessage.userId === userId) {
            setMatch(matchMessage.matchUserId);
            console.log(`Matched with User ID: ${matchMessage.matchUserId}`);
          }
          channel.ack(msg);
        }
      });
    };

    listenForMatches();

    return () => {
      // Cleanup connection on component unmount (optional)
    };
  }, [userId]);

  const sendSearchRequest = async () => {
    const connection = await connect('amqp://user:password@rabbitmq:5672/');
    const channel = await connection.createChannel();
    
    const searchMessage: SearchMessage = {
      userId,
      difficulty,
      topics,
    };

    await channel.sendToQueue('search_queue', Buffer.from(JSON.stringify(searchMessage)));
    console.log(`Search request sent for User ID: ${userId}`);

    setSearching(true);

    // Set timeout for 5 minutes
    setTimeout(async () => {
      await channel.sendToQueue('disconnect_queue', Buffer.from(JSON.stringify({ userId })));
      console.log(`User ID: ${userId} has disconnected after 5 minutes.`);
      setSearching(false);
      channel.close();
      connection.close();
    }, 5 * 60 * 1000); // 5 minutes
  };

  const stopSearching = async () => {
    const connection = await connect('amqp://user:password@rabbitmq:5672/');
    const channel = await connection.createChannel();
    
    await channel.sendToQueue('disconnect_queue', Buffer.from(JSON.stringify({ userId })));
    console.log(`User ID: ${userId} has disconnected intentionally.`);
    
    setSearching(false);
    channel.close();
    connection.close();
  };

  return (
    <div>
      <h1>Matching Service</h1>
      <input 
        value={difficulty} 
        onChange={(e) => setDifficulty(e.target.value)} 
        placeholder="Enter Difficulty" 
      />
      <input 
        value={topics} 
        onChange={(e) => setTopics(e.target.value)} 
        placeholder="Enter Topics (comma separated)" 
      />
      <button onClick={sendSearchRequest} disabled={searching}>Search</button>
      <button onClick={stopSearching} disabled={!searching}>Stop Searching</button>

      {match && <p>Matched with User ID: {match}</p>}
      {!match && searching && <p>Searching for a match...</p>}
      {!match && !searching && <p>No match found yet.</p>}
    </div>
  );
};

export default Matching;

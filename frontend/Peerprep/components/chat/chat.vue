<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineExpose } from 'vue';
import Toaster from '@/components/ui/toast/Toaster.vue';
import { io } from "socket.io-client";
import axios from 'axios';

// Define the Message interface
interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: string; // Assuming timestamp is received as a string
  avatar?: string;   // Optional, if available
  // Add other properties if necessary
}

const user = useCurrentUser();
// Connect to Socket.IO server
const socket = io('http://localhost:5002'); // Server address

// Define response status
const messages = ref<Message[]>([]);
const message = ref('');
const conversations = ref<any[]>([]); // Update to 'any' or a proper interface if available
const selectedConversation = ref<string | null>(null); // Track selected conversation

// Function for sending message
const sendMessage = () => {
  console.log(message.value);
  if (message.value.trim() && selectedConversation.value) {
    const messageData = {
      conversation: selectedConversation.value,
      message: message.value,
      username: user?.value?.email,
      // Optionally, add a timestamp here if needed
    };
    socket.emit('chat message', messageData);
    message.value = ''; // Clear input text box
  }
};

// Function for sending "stop" message
const sendStopMessage = () => {
  socket.emit('chat message', { conversation: selectedConversation.value, message: "stop", username: user?.value?.email });
  loadConversations(); // Load convo list
};

// Function to receive messages
const receiveMessage = (msg: { conversation: string; message: Message }) => {
  if (msg.conversation === selectedConversation.value) {
    messages.value.push(msg.message);
  }
};

// Function to format timestamp
const formatTimestamp = (timestamp: string | number | Date) => {
  let date: Date;

  if (typeof timestamp === 'number') {
    // Check if timestamp is in seconds (10 digits) or milliseconds (13 digits)
    if (timestamp.toString().length === 10) {
      date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    } else {
      date = new Date(timestamp);
    }
  } else if (typeof timestamp === 'string') {
    // Preprocess the timestamp string to ensure it's a valid ISO format
    const isoRegex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})(\.\d{1,3})?\d*$/;
    const match = timestamp.match(isoRegex);
    let processedTimestamp = timestamp;

    if (match) {
      const [_, main, fraction] = match;
      if (fraction) {
        // Ensure milliseconds have exactly three digits
        let milliseconds = fraction.substring(0, 4); // Includes the dot
        while (milliseconds.length < 4) {
          milliseconds += '0';
        }
        processedTimestamp = `${main}${milliseconds}Z`;
      } else {
        // If no fractional seconds, append '.000Z'
        processedTimestamp = `${main}.000Z`;
      }
    } else {
      // If the format doesn't match, attempt to append 'Z'
      processedTimestamp = `${timestamp}Z`;
    }

    date = new Date(processedTimestamp);
  } else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) {
    console.error("Invalid date format:", timestamp);
    return "Invalid date";
  }

  // Return the date in the user's local timezone
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Function to select a conversation
const selectConversation = (conversation: string) => {
  selectedConversation.value = conversation; // Set the selected conversation
  loadHistory(conversation); // Load history for the selected conversation
};

// Function to load conversations
const loadConversations = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:5002/api/conversations/${user?.value?.uid}`);
    conversations.value = response.data.conversations;

    // Automatically select the newest/active conversation (the one in green)
    const activeConversation = conversations.value.find((conv: any) => conv.flag === 'active');
    if (activeConversation) {
      selectedConversation.value = activeConversation.sessionName;
      loadHistory(activeConversation.sessionName); // Load history for the active conversation
    }
  } catch (error) {
    console.error('Error loading conversations:', error);
  }
};

// Function to load chat history
const loadHistory = async (conversation: string) => {
  try {
    const response = await axios.get(`http://127.0.0.1:5002/api/history/${conversation}`);
    // Assuming response.data.messages is an array of Message objects
    messages.value = response.data.messages;
    selectedConversation.value = conversation; // Set selected convo here
  } catch (error) {
    console.error('Error loading history:', error);
  }
};

// When component is mounted, set up Socket.IO events
onMounted(() => {
  socket.on('chat message', receiveMessage);
  socket.on('new_conversation', () => {
    loadConversations(); // Reload conversations when a new one is created
  });

  loadConversations(); // Initial load
});

// When component is unmounted, remove Socket.IO events
onUnmounted(() => {
  socket.off('chat message', receiveMessage);
});

defineExpose({
  sendStopMessage
});
</script>

<template>
  <div class="container py-10 mx-auto flex">
    <div class="conversation-list">
      <h1 style="font-weight: bold; font-size: 20px;">Select a Conversation</h1>
      <ul>
        <li
          v-for="(conversation, index) in conversations"
          :key="index"
          :class="{ 'active-conversation': conversation.sessionName === selectedConversation }"
          @click="selectConversation(conversation.sessionName)"
        >
          <span :style="{ color: conversation.flag === 'active' ? 'green' : 'red' }">
            ● <!-- char for status indicator (green/red) -->
          </span>
          {{ conversation.sessionName.slice(0, 15) }}
          <!-- Making convo sessionName shorter on screen -->
        </li>
      </ul>
    </div>
    <div class="chat-window">
      <div id="messages" class="messages">
        <div v-for="msg in messages" :key="msg.id" class="message-item">
          <div class="avatar">
            <img :src="msg.avatar" :alt="msg.username" />
          </div>
          <div class="message-content">
            <div class="username">{{ msg.username }}</div>
            <div class="text">{{ msg.message }}</div>
            <div class="timestamp">{{ formatTimestamp(msg.timestamp) }}</div>
          </div>
        </div>
      </div>
      <input
        v-model="message"
        @keyup.enter="sendMessage"
        placeholder="Message..."
        class="input-message"
      />
      <button @click="sendMessage" class="send-button">Send</button>
      <button @click="sendStopMessage" class="stop-button">Stop</button>
    </div>
  </div>
  <Toaster />
</template>

<style scoped>
.container {
  display: flex;
}
.conversation-list {
  width: 25%;
  border-right: 1px solid #ccc;
  padding: 20px;
}

.chat-window {
  width: 75%;
  padding: 20px;
}

.messages {
  border: 1px solid #ccc;
  padding: 10px;
  height: 400px;
  overflow-y: auto;
}

.message-item {
  display: flex;
  margin-bottom: 10px;
}

.avatar img {
  display: none;
}

.message-content {
  flex-grow: 1;
}

.username {
  font-weight: bold;
}

.timestamp {
  font-size: 12px;
  color: #888;
}

.input-group {
  display: flex;
  align-items: center;
  margin-top: auto; /* Push input group to bottom */
}

.input-message {
  width: 80%;
  flex-grow: 1; /* Msg box occupying left space */
  padding: 10px; /* Adding inner margin */
  margin-right: 10px; /* Inner margin with send btn */
  border: 1px solid #ccc;
  border-radius: 4px;
}

.send-button {
  padding: 10px 20px; /* Inner padding */
  background-color: #007bff; /* Send btn color */
  color: white; /* Text color */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.stop-button {
  display: none;
}

.send-button:hover {
  background-color: #0056b3;
}

.conversation-list ul li {
  padding: 10px;
  margin: 5px 0;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.1s, box-shadow 0.1s;
}

.conversation-list ul li:hover {
  background-color: #f0f0f0;
}

.active-conversation {
  background-color: #e0e0e0;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.3);
  transform: translateY(2px);
  font-weight: bold;
  color: #333;
}
</style>

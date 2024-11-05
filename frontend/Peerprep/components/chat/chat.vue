<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineExpose } from 'vue';
import Toaster from '@/components/ui/toast/Toaster.vue';
import { io } from "socket.io-client";
import axios from 'axios';

const user = useCurrentUser();
// connect to Socket.IO server
const socket = io('http://localhost:5002'); // server address

// define response status
const messages = ref<string[]>([]);
const message = ref('');
const conversations = ref<string[]>([]);
// const selectedConversation = ref('');
const selectedConversation = ref<string | null>(null); // Track selected conversation

// func for sending msg
const sendMessage = () => {
  console.log(message.value)
  if (message.value.trim() && selectedConversation.value) {
    socket.emit('chat message', { conversation: selectedConversation.value, message: message.value ,username:user?.value?.email});
    message.value = ''; // clear input text box
  }
};


const sendStopMessage = () => {
  socket.emit('chat message', { conversation: selectedConversation.value, message: "stop", username: user?.value?.email });
  loadConversations(); // load convo list
};

// monitor recv'd msg
const receiveMessage = (msg: { conversation: string; message: string }) => {
  if (msg.conversation === selectedConversation.value) {
    messages.value.push(msg.message);
  }
};

// 


const selectConversation = (conversation: string) => {
  selectedConversation.value = conversation; // Set the selected conversation
  loadHistory(conversation); // Load history for the selected conversation
};


const loadConversations = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:5002/api/conversations/${user?.value?.uid}`);
    conversations.value = response.data.conversations;

    // Automatically select the newest/active conversation (the one in green)
    const activeConversation = conversations.value.find((conv) => conv.flag === 'active');
    if (activeConversation) {
      selectedConversation.value = activeConversation.sessionName;
      loadHistory(activeConversation.sessionName); // Load history for the active conversation
    }
  } catch (error) {
    console.error('Error loading conversations:', error);
  }
};

// load history func
const loadHistory = async (conversation: string) => {
  const response = await axios.get(`http://127.0.0.1:5002/api/history/${conversation}`);
  messages.value = response.data.messages; // updates messsages
  selectedConversation.value = conversation; // set selected convo here
};

// when mount socket, set Socket.IO event
onMounted(() => {
  socket.on('chat message', receiveMessage);
  loadConversations(); // load convo list
});

// when unmount socket, clear Socket.IO event
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
  <!-- making convo sessionName shorter on screen-->
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
            <div class="timestamp">{{ new Date(msg.timestamp).toLocaleTimeString() }}</div>
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
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
  margin-top: auto; /* push input group to bottom */
}

.input-message {
  width: 80%;
  flex-grow: 1; /* msg box occupying left space */
  padding: 10px; /* adding inner margin */
  margin-right: 10px; /* innermargin with send btn */
  border: 1px solid #ccc; /*  */
  border-radius: 4px; /*  */
}

.send-button {
  padding: 10px 20px; /* inner padding */
  background-color: #007bff; /* send btn color */
  color: white; /* txt color */
  border: none; /*  */
  border-radius: 4px; /*  */
  cursor: pointer; /*  */
  transition: background-color 0.3s; /*  */
}
.stop-button {
  display: none;
}

.send-button:hover {
  background-color: #0056b3; /*  */
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

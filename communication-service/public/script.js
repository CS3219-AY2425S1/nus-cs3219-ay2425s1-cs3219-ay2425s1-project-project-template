const socket = io();
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const messages = document.getElementById('messages');

let localStream;
let peerConnection;
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

// Check for media device support
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      localStream = stream;
      localVideo.srcObject = stream;
      initWebRTC();
    })
    .catch((error) => {
      console.error('Error accessing media devices:', error);
    });
} else {
  alert("getUserMedia is not supported on this browser. Please use the latest version of Chrome or Firefox.");
}

// Initialize WebRTC and Socket.IO signaling
function initWebRTC() {
  socket.on('offer', async (data) => {
    if (!peerConnection) createPeerConnection();
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer);
  });

  socket.on('answer', (data) => {
    peerConnection.setRemoteDescription(new RTCSessionDescription(data));
  });

  socket.on('candidate', (data) => {
    if (peerConnection) {
      peerConnection.addIceCandidate(new RTCIceCandidate(data));
    }
  });

  createPeerConnection();
}

// Create a new RTCPeerConnection
function createPeerConnection() {
  peerConnection = new RTCPeerConnection(config);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('candidate', event.candidate);
    }
  };

  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });
}

// Start a new call by creating an offer
async function startCall() {
  if (!peerConnection) createPeerConnection();
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('offer', offer);
}

// Chat functionality
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const msg = chatInput.value;
  if (msg.trim()) {
    // Emit message to server
    socket.emit('chatMessage', { msg: msg, id: socket.id });
    // Display your own message locally
    chatInput.value = '';
  }
}

// Display received messages only from the peer
socket.on('chatMessage', ({ msg: msg, id: id}) => {
  displayMessage(`${id}: ${msg}`);
});

// Display chat messages in the UI
function displayMessage(message) {
  const msgElem = document.createElement('div');
  msgElem.textContent = message;
  messages.appendChild(msgElem);
}

// Automatically start the call when the page loads
document.getElementById('startCallBtn').addEventListener('click', startCall);

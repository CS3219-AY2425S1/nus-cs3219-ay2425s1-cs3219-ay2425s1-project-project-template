const socket = io();
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const messages = document.getElementById('messages');
const muteMicBtn = document.getElementById('muteMicBtn'); // Mute Button

let localStream;
let peerConnection;
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      localStream = stream;
      localVideo.srcObject = stream;
      initWebRTC();
    })
    .catch((error) => {
      alert(`Error accessing media devices: ${error.message}`);
    });
} else {
  alert("getUserMedia is not supported on this browser. Please use the latest version of Chrome or Firefox.");
}

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

async function startCall() {
  if (!peerConnection) createPeerConnection();
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('offer', offer);
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const msg = chatInput.value;
  if (msg.trim()) {
    socket.emit('chatMessage', msg);
    chatInput.value = '';
    displayMessage(`You: ${msg}`);
  }
}

socket.on('chatMessage', (msg) => {
  displayMessage(`Peer: ${msg}`);
});

function displayMessage(message) {
  const msgElem = document.createElement('div');
  msgElem.textContent = message;
  messages.appendChild(msgElem);
}

// Toggle Mute Functionality
let isMuted = false;
muteMicBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  localStream.getAudioTracks()[0].enabled = !isMuted;
  muteMicBtn.textContent = isMuted ? 'Unmute Mic' : 'Mute Mic';
});

document.getElementById('startCallBtn').addEventListener('click', startCall);

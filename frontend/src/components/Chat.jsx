import React, { useState, useEffect } from "react";
import { Box, TextField, Button, List, ListItem, ListItemText, Typography } from "@mui/material";

export default function Chat({ provider }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // Use a Yjs array for chat messages
    const chatArray = provider.doc.getArray("chatMessages");

    useEffect(() => {
        // Load existing messages and listen for new ones
        setMessages(chatArray.toArray());

        const updateMessages = () => setMessages(chatArray.toArray());
        chatArray.observe(updateMessages);

        return () => chatArray.unobserve(updateMessages);
    }, [chatArray]);

    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            chatArray.push([{ userId: "User1", text: newMessage, timestamp: Date.now() }]);
            setNewMessage("");
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Typography variant="h6" sx={{ textAlign: "center", padding: 1 }}>
                Chat Room
            </Typography>
            <Box sx={{ flexGrow: 1, overflowY: "auto", margin: 1 }}>
                <List>
                    {messages.map((msg, index) => (
                        <ListItem key={index} alignItems="flex-start">
                            <ListItemText
                                primary={`${msg.userId}: ${msg.text}`}
                                secondary={new Date(msg.timestamp).toLocaleTimeString()}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", padding: 1 }}>
                <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") handleSendMessage();
                    }}
                />
                <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ marginLeft: 1 }}>
                    Send
                </Button>
            </Box>
        </Box>
    );
}


// import React, { useEffect, useState } from "react";
// import { Box, TextField, Button, List, ListItem, ListItemText, Typography } from "@mui/material";

// export default function Chat({ yArray }) {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");

//     // Listen for changes in the Yjs array and update the message list
//     useEffect(() => {
//         // Initial load of existing messages
//         setMessages(yArray.toArray());

//         // Observe changes to the Yjs array
//         const updateMessages = () => setMessages(yArray.toArray());
//         yArray.observe(updateMessages);

//         // Cleanup listener on component unmount
//         return () => yArray.unobserve(updateMessages);
//     }, [yArray]);

//     // Handle new message submission
//     const handleSendMessage = () => {
//         if (newMessage.trim() !== "") {
//             yArray.push([{ user: "User1", text: newMessage, timestamp: Date.now() }]);
//             setNewMessage("");
//         }
//     };

//     return (
//         <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
//             <Typography variant="h6" sx={{ textAlign: "center", padding: 1 }}>
//                 Chat Room
//             </Typography>
//             <Box sx={{ flexGrow: 1, overflowY: "auto", margin: 1 }}>
//                 <List>
//                     {messages.map((msg, index) => (
//                         <ListItem key={index} alignItems="flex-start">
//                             <ListItemText
//                                 primary={`${msg.user}: ${msg.text}`}
//                                 secondary={new Date(msg.timestamp).toLocaleTimeString()}
//                             />
//                         </ListItem>
//                     ))}
//                 </List>
//             </Box>
//             <Box sx={{ display: "flex", alignItems: "center", padding: 1 }}>
//                 <TextField
//                     variant="outlined"
//                     size="small"
//                     fullWidth
//                     placeholder="Type a message..."
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     onKeyPress={(e) => {
//                         if (e.key === "Enter") handleSendMessage();
//                     }}
//                 />
//                 <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ marginLeft: 1 }}>
//                     Send
//                 </Button>
//             </Box>
//         </Box>
//     );
// }

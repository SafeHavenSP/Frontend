import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { TextField, Button, Box, Typography, Divider } from '@mui/material';
import './styles/DM.css'; 
import url from './url'
import NavBar from './NavBar'; 


const DM = () => {
  const { chatId } = `${sessionStorage.getItem('username')}_${sessionStorage.getItem("user2")}`;
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const user1 = sessionStorage.getItem('username');
        const user2 = sessionStorage.getItem('user2');
        
        
        let response = await axios.get(`${url.url}/get-messages`, { params: { user1, user2 } });

        const messagesData = response.data;
        const transformedMessages = Object.keys(messagesData).map(key => ({
          ...messagesData[key],
          id: key
        }));

       
        if (Array.isArray(transformedMessages)) {
          setMessages(transformedMessages);
          console.log(transformedMessages)
        } else {
          console.error('Unexpected data format:', response.data);
          setMessages([]); 
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to fetch messages');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const sender = sessionStorage.getItem('username');
      const receiver = sessionStorage.getItem("user2");
    
      await axios.post(`${url.url}/send-message`, {
        sender,
        receiver,
        message: newMessage
      });

     
      setMessages([...messages, { text: newMessage, sender, date: new Date() }]);
      setNewMessage(''); 
      window.location.reload();


    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>{error}</div>;

  return (
    
    <div className="dm-container">
         <div className="chat_header">
      {sessionStorage.getItem("user2")}
                </div>


      <div className="messages-container">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.sender === sessionStorage.getItem('username') ? 'sent' : 'received'}`}>
              <Typography variant="body1">{msg.message}</Typography>
              <Typography variant="caption">
  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'no date'}
                </Typography>

            </div>
          ))
        ) : (
          <div>No messages yet.</div>
        )}
      </div>
      <Box className="message-input">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
      <NavBar />
    </div>
  );
};

export default DM;

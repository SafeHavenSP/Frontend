import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/Message.css'; 
import url from './url'
import NavBar from './NavBar'; 
import { useNavigate  } from 'react-router-dom';




const Message = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  

    useEffect(() => {
    const fetchChats = async () => {
      try {
        const username = sessionStorage.getItem("username"); 
        const response = await axios.get(`${url.url}/user-chats`, { params: { username } });
        setChats(response.data);
        console.log(response.data)
      } catch (err) {
        setError('Failed to fetch chats');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleCardClick = (chatId) => {
    const chat = chats[chatId];
    const username = sessionStorage.getItem('username');
    const oppositeUser = chat?.oppositeUser;

    if (oppositeUser) {
        sessionStorage.setItem("user2", oppositeUser)
        navigate(`/dm`); 
       // console.log("opp user", oppositeUser)
      } else {
        console.error('Chat data is missing');
      }
  
    //navigate('/dm');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="message-container">
      {Object.keys(chats).length === 0 ? (
        <div className="no-chats">No chats yet</div>
      ) : (
        <div className="chat-list">
          {Object.entries(chats).map(([chatId, chat]) => (
            <div
              key={chatId}
              className="chat-card"
              onClick={() => handleCardClick(chatId)}
            >
              <div className="chat-header">
                <h3>{chat.oppositeUser}</h3>
              </div>
              <div className="chat-body">
                <p>{chat.mostRecentMessage}</p>
                <span>{new Date(chat.date).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
       <NavBar />
    </div>
  );
};

export default Message;

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import websocketService from '../services/websocketService';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Connect to WebSocket
      websocketService.connect(user.id, {
        onConnect: () => {
          console.log('WebSocket connected for user:', user.id);
          setConnected(true);
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected');
          setConnected(false);
        },
        onMessage: (message) => {
          console.log('New message received:', message);
          setMessages((prev) => [...prev, message]);
          
          // Show browser notification
          if (Notification.permission === 'granted') {
            new Notification('New Message', {
              body: `${message.senderName}: ${message.message}`,
              icon: '/favicon.ico',
            });
          }
        },
        onNotification: (notification) => {
          console.log('New notification received:', notification);
          setNotifications((prev) => [...prev, notification]);
          
          // Show browser notification
          if (Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico',
            });
          }
        },
      });

      // Request browser notification permission
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }

      // Cleanup on unmount
      return () => {
        websocketService.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  const sendMessage = (receiverId, message) => {
    if (connected && user?.id) {
      websocketService.sendMessage(user.id, receiverId, message);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    connected,
    messages,
    notifications,
    sendMessage,
    clearMessages,
    clearNotifications,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
};
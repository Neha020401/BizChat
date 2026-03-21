import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = {};
  }

  connect(userId, callbacks) {
    if (this.client) {
      console.log('WebSocket already connected');
      return;
    }

    // Create SockJS connection
    const socket = new SockJS('http://localhost:8080/ws');

    // Create STOMP client
    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      onConnect: () => {
        console.log('WebSocket Connected');
        this.connected = true;

        // Subscribe to messages
        if (callbacks.onMessage) {
          this.subscriptions.messages = this.client.subscribe(
            `/user/${userId}/queue/messages`,
            (message) => {
              const data = JSON.parse(message.body);
              callbacks.onMessage(data);
            }
          );
        }

        // Subscribe to notifications
        if (callbacks.onNotification) {
          this.subscriptions.notifications = this.client.subscribe(
            `/user/${userId}/queue/notifications`,
            (notification) => {
              const data = JSON.parse(notification.body);
              callbacks.onNotification(data);
            }
          );
        }

        if (callbacks.onConnect) {
          callbacks.onConnect();
        }
      },

      onDisconnect: () => {
        console.log('WebSocket Disconnected');
        this.connected = false;
        if (callbacks.onDisconnect) {
          callbacks.onDisconnect();
        }
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
    });

    this.client.activate();
  }

  sendMessage(senderId, receiverId, message) {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({
        senderId,
        receiverId,
        message,
      }),
    });
  }

  disconnect() {
    if (this.client) {
      // Unsubscribe from all subscriptions
      Object.values(this.subscriptions).forEach((sub) => {
        if (sub) sub.unsubscribe();
      });
      this.subscriptions = {};

      // Deactivate client
      this.client.deactivate();
      this.client = null;
      this.connected = false;
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new WebSocketService();

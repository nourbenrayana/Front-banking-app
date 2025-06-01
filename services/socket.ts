import { io } from "socket.io-client";
import config from '@/utils/config';

const socket = io(`${config.BASE_URL}`, {
  reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false, // La connexion sera gérée par le NotificationContext
    transports: ['websocket']
});

export default socket;

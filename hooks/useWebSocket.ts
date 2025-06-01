import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { io, Socket } from 'socket.io-client';
import * as Notifications from 'expo-notifications';
import config from '../utils/config';
import { useUser } from '../context/UserContext';

interface NotificationData {
  title: string;
  message: string;
  [key: string]: any;
}

export const useWebSocket = () => {
  const { userData } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log('🔔 Permissions des notifications:', status);
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Vous ne recevrez pas de notifications push');
      }

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    };

    setupNotifications();
  }, []);

  useEffect(() => {
    if (!userData?.userId) return;

    const newSocket: Socket = io(config.BASE_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsSocketReady(true);
      const formattedUserId = userData.userId.startsWith('users/')
        ? userData.userId
        : `users/${userData.userId}`;
      newSocket.emit('authenticate', formattedUserId);
    });

    newSocket.on('connect_error', (err) => {
      console.log('❌ Connection error:', err);
      setIsSocketReady(false);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from WebSocket server');
      setIsSocketReady(false);
    });

    newSocket.on('reconnect', (attempt) => {
      console.log(`♻️ Reconnected after ${attempt} attempts`);
      setIsSocketReady(true);
      const formattedUserId = userData.userId.startsWith('users/')
        ? userData.userId
        : `users/${userData.userId}`;
      newSocket.emit('authenticate', formattedUserId);
    });

    newSocket.on('notification', async (data) => {
      console.log('🔔 Notification reçue (WebSocket):', JSON.stringify(data));
      const payload = data.payload || data;
      setNotification(payload);

      // Afficher une alerte immédiate
      Alert.alert(payload.title, payload.message);
      console.log('📣 Alert.alert déclenchée');

      // Envoyer une notification push
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: payload.title,
            body: payload.message,
            data: payload.data || {},
          },
          trigger: null,
        });
        console.log('📱 Notification push programmée');
      } catch (error) {
        console.error('⚠️ Erreur lors de la programmation de la notification push:', error);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userData?.userId]);

  return { socket, notification, isSocketReady };
};

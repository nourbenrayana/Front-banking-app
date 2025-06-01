import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert, AppState, AppStateStatus } from "react-native";
import socket from "../services/socket";
import { useUser } from "./UserContext";
import { Platform } from 'react-native';

interface NotificationData {
    transactionId?: string;
    montant?: number;
    expediteur?: string;
    destinataire?: string;
    type?: string;
}

interface Notification {
    title: string;
    message: string;
    data?: NotificationData;
    timestamp?: string;
}

interface NotificationContextProps {
    notifications: Notification[];
    clearNotifications: () => void;
    unreadCount: number;
}

const NotificationContext = createContext<NotificationContextProps>({
    notifications: [],
    clearNotifications: () => {},
    unreadCount: 0,
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { userData } = useUser();
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    // Gestion de l'état de l'application (foreground/background)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            setAppState(nextAppState);
            if (nextAppState === 'active') {
                setUnreadCount(0); // Réinitialiser le compteur quand l'app devient active
            }
        });

        return () => subscription.remove();
    }, []);

    // Gestion des connexions WebSocket
useEffect(() => {
  if (!userData?.userId) return;

  console.log('Initializing socket for user:', userData.userId);

  socket.connect();

  socket.on('connect', () => {
    console.log('Socket connected, identifying user...');
    socket.emit('identify', userData.userId);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.log('Socket connection error:', err.message);
    setTimeout(() => socket.connect(), 5000); // Reconnecte après délai
  });

  const onNotification = (notification: Notification) => {
    console.log('Received notification:', notification);

    setNotifications(prev => [notification, ...prev]);

    if (appState !== 'active') {
      setUnreadCount(prev => prev + 1);
      Alert.alert(
        notification.title,
        notification.message,
        [
          {
            text: 'Voir',
            onPress: () => setUnreadCount(0)
          },
          { text: 'OK' }
        ]
      );
    }
  };

  socket.on('notification', onNotification);

  return () => {
    socket.off('notification', onNotification);
    socket.off('connect');
    socket.off('disconnect');
    socket.off('connect_error');
    socket.disconnect();
  };
}, [userData?.userId, appState]);


    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            clearNotifications,
            unreadCount 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
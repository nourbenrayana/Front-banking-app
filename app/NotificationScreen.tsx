import { View, Text, StyleSheet, FlatList, TouchableOpacity ,Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import config from "@/utils/config";
import { ActivityIndicator } from "react-native";

interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
    type?: "info" | "success" | "warning" | "error"; // Optionnel, pour personnaliser les icônes
}

export default function NotificationScreen() {
    const { userData } = useUser();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const rawUserId = userData.userId.replace(/^users\//, "").replace(/^\/users\//, "");
                const res = await fetch(`${config.BASE_URL}/api/transactions/notifications/${rawUserId}`);
                const data: Notification[] = await res.json();
                setNotifications(data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [userData.userId]);

    const markAsRead = async (notificationId: string) => {
        try {
            await fetch(`${config.BASE_URL}/api/transactions/notifications/read/${notificationId}`, {
                method: "PUT",
            });

            setNotifications((prev) =>
                prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
            );
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const getIconForType = (type?: string) => {
        switch (type) {
            case "success":
                return <Ionicons name="checkmark-circle" size={28} color="#2E86DE" />;
            case "warning":
                return <Ionicons name="warning" size={28} color="#FFA726" />;
            case "error":
                return <Ionicons name="close-circle" size={28} color="#EF5350" />;
            default:
                return <Ionicons name="notifications" size={28} color="#2E86DE" />;
        }
    };
    const deleteNotification = async (notificationId: string) => {
    try {
        await fetch(`${config.BASE_URL}/api/transactions/notifications/${notificationId}`, {
            method: "DELETE",
        });

        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
        console.error("Error deleting notification:", error);
    }
};
const deleteAllNotifications = async () => {
    try {
        const rawUserId = userData.userId.replace(/^users\//, "").replace(/^\/users\//, "");
        await fetch(`${config.BASE_URL}/api/transactions/notifications/all/${rawUserId}`, {
            method: "DELETE",
        });
        
        setNotifications([]);
        Alert.alert("Succès", "Toutes les notifications ont été supprimées");
    } catch (error) {
        console.error("Error deleting all notifications:", error);
        Alert.alert("Erreur", "Impossible de supprimer toutes les notifications");
    }
};

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[styles.notificationItem, !item.read && styles.unreadNotification]}
            onPress={() => markAsRead(item.id)}
        >
            {getIconForType(item.type)}
            <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationDate}>
                    {new Date(item.date).toLocaleString()}
                </Text>
            </View>
            {!item.read && <View style={styles.unreadBadge} />}
            <TouchableOpacity onPress={() => deleteNotification(item.id)}>
                <MaterialIcons name="delete" size={24} color="#f00020" />
            </TouchableOpacity>
        </TouchableOpacity>

    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Notifications</Text>
                <View style={styles.headerActions}>
                    {notifications.some((n) => !n.read) && (
                        <View style={styles.unreadCounter}>
                            <Text style={styles.unreadCounterText}>
                                {notifications.filter((n) => !n.read).length}
                            </Text>
                        </View>
                    )}
                    {notifications.length > 0 && (
                        <TouchableOpacity onPress={deleteAllNotifications}>
                            <MaterialIcons name="delete-sweep" size={24} color="#f00020" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2E86DE" />
                    <Text style={styles.loadingText}>Chargement des notifications...</Text>
                </View>
            ) : notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="notifications-off-outline" size={60} color="#CBD5E0" />
                    <Text style={styles.emptyText}>Aucune notification pour le moment</Text>
                    <Text style={[styles.emptyText, { fontSize: 14, marginTop: 5 }]}>
                        Nous vous informerons quand quelque chose d'important se produira
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={notifications.sort(
                        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                    )}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#F5F7FA",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
    },
    header: {
        fontSize: 28,
        fontWeight: "800",
        color: "#2E86DE",
        paddingTop: 10,
    },
    unreadCounter: {
        backgroundColor: "#f00020",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 3,
        marginLeft: 10,
    },
    unreadCounterText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
    listContainer: {
        paddingBottom: 20,
    },
    notificationItem: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: "#E0E0E0",
    },
    unreadNotification: {
        borderLeftColor: "#2E86DE",
        backgroundColor: "#F0F8FF",
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1A1A2E",
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 14,
        color: "#4A5568",
        marginBottom: 6,
    },
    notificationDate: {
        fontSize: 12,
        color: "#718096",
        fontWeight: "500",
    },
    unreadBadge: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#f00020",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        color: "#718096",
        marginTop: 15,
        textAlign: "center",
        lineHeight: 24,
        fontWeight: "500",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "#4A5568",
        marginTop: 10,
    },
    notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
},
headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    gap: 10,
},

});

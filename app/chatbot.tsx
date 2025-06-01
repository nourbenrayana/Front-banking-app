import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Easing
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import config from '@/utils/config';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'delivered' | 'read';
};

const ChatbotScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! 👋 Je suis votre assistant bancaire intelligent. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, []);

  // Auto-scroll et animations
  useEffect(() => {
    if (messages.length > 1) {
      flatListRef.current?.scrollToEnd({ animated: true });
      
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 100,
          useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Ajouter le message de l'utilisateur avec état "sending"
    const userMessage: Message = { 
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Animation d'envoi
    Animated.spring(scaleAnim, {
      toValue: 1.2,
      friction: 3,
      useNativeDriver: true
    }).start(() => {
      scaleAnim.setValue(1);
    });

    // Simulation de délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mettre à jour le statut du message
    setMessages(prev => prev.map(msg => 
      msg.id === userMessage.id ? {...msg, status: 'delivered'} : msg
    ));

    // Appeler le backend Flask
    try {
      const response = await fetch(`${config.URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: inputText }),
      });
      const data = await response.json();

      
      
      // Ajouter la réponse du chatbot avec animation
      const botMessage: Message = { 
        id: Date.now().toString(),
      
        text: data.answer,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { 
        id: Date.now().toString(),
        text: "Désolé, service temporairement indisponible. Notre équipe technique est alertée.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderStatusIcon = (status: Message['status']) => {
    switch(status) {
      case 'sending':
        return <Feather name="clock" size={12} color="#aaa" style={styles.statusIcon} />;
      case 'delivered':
        return <Ionicons name="checkmark-done" size={12} color="#aaa" style={styles.statusIcon} />;
      case 'read':
        return <Ionicons name="checkmark-done" size={12} color="#2e86de" style={styles.statusIcon} />;
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.background}
      />
      
      {/* Header */}
      <LinearGradient
        colors={['#2e86de', '#1e6fbf']}
        style={styles.header}
      >
        <Image 
          source={require('../assets/images/logo.png')} 
          style={styles.avatar}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Assistant Virtuel</Text>
          <Text style={styles.headerSubtitle}>Banque Digitale</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="search" size={22} color="white" style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={22} color="white" style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Animated.View 
            style={[
              styles.messageBubble, 
              item.sender === 'user' ? styles.userBubble : styles.botBubble,
              { transform: [{ scale: scaleAnim }] }
            ]}
          >
            {item.sender === 'bot' && (
              <Image 
                source={require('../assets/images/logo.png')} 
                style={styles.messageAvatar}
              />
            )}
            <View style={item.sender === 'user' ? styles.userMessageContent : styles.botMessageContent}>
              <Text style={item.sender === 'user' ? styles.userMessageText : styles.botMessageText}>
                {item.text}
              </Text>
              <View style={styles.messageFooter}>
                <Text style={item.sender === 'user' ? styles.userMessageTime : styles.botMessageTime}>
                  {formatTime(item.timestamp)}
                </Text>
                {item.sender === 'user' && renderStatusIcon(item.status)}
              </View>
            </View>
          </Animated.View>
        )}
        ListFooterComponent={<View style={{ height: 20 }} />}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TouchableOpacity style={styles.attachmentButton}>
          <Ionicons name="attach" size={24} color="#2e86de" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Écrivez votre message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            inputText.trim() ? styles.activeSendButton : styles.inactiveSendButton
          ]} 
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons 
              name="send" 
              size={22} 
              color={inputText.trim() ? 'white' : '#ccc'} 
            />
          </Animated.View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  headerTextContainer: {
    flex: 1
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 2
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500'
  },
  headerIcons: {
    flexDirection: 'row'
  },
  headerIcon: {
    marginLeft: 20
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 100
  },
  messageBubble: {
    maxWidth: '85%',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  botBubble: {
    alignSelf: 'flex-start'
  },
  userBubble: {
    alignSelf: 'flex-end'
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: 'flex-end'
  },
  botMessageContent: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  userMessageContent: {
    backgroundColor: '#2e86de',
    padding: 14,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    shadowColor: '#2e86de',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  botMessageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333'
  },
  userMessageText: {
    fontSize: 16,
    lineHeight: 22,
    color: 'white'
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4
  },
  botMessageTime: {
    fontSize: 11,
    color: '#999',
    marginRight: 4
  },
  userMessageTime: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginRight: 4
  },
  statusIcon: {
    marginLeft: 2
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 25 : 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  attachmentButton: {
    padding: 8,
    marginRight: 8
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    fontSize: 16,
    lineHeight: 20
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    overflow: 'hidden'
  },
  activeSendButton: {
    backgroundColor: '#2e86de'
  },
  inactiveSendButton: {
    backgroundColor: '#f0f0f0'
  }
});

export default ChatbotScreen;
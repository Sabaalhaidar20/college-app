import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import io from 'socket.io-client';
import { useAuth } from './_layout';
import styles from './styles';

export default function MessageScreen() {
  const { user } = useAuth();
  const { userId, userName } = useLocalSearchParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const socket = React.useMemo(() => {
    if (!user) return null;
    return io('http://localhost:5000', {
      transports: ['websocket'],
      withCredentials: true,
    });
  }, [user]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit('join', { user_id: user.id });

    socket.on('receive_message', (msg) => {
      if (
        (msg.sender_id === user.id && msg.receiver_id === Number(userId)) ||
        (msg.sender_id === Number(userId) && msg.receiver_id === user.id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off('receive_message');
      socket.disconnect();
    };
  }, [socket, user, userId]);

  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/messages/${userId}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load messages');
        const data = await res.json();
        setMessages(data);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user, userId]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket || !user) return;

    const msg = {
      sender_id: user.id,
      receiver_id: Number(userId),
      content: input.trim(),
    };

    socket.emit('send_message', msg);
    setMessages((prev) => [...prev, msg]);
    setInput('');
  };

  if (!user || loading) {
    return (
      <View style={styles.loadingContainerMsg}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.outerContainerMsg}>
      <View style={styles.headerMsg}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButtonMsg}
        >
          <Text style={styles.backButtonTextMsg}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitleMsg}>Chat with {userName}</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesScrollViewMsg}
        contentContainerStyle={styles.messagesContentContainerMsg}
      >
        {messages.map((msg, idx) => {
          const isMine = msg.sender_id === user.id;
          return (
            <View
              key={idx}
              style={
                isMine
                  ? styles.messageBubbleMineMsg
                  : styles.messageBubbleOtherMsg
              }
            >
              <Text
                style={
                  isMine
                    ? styles.messageTextMineMsg
                    : styles.messageTextOtherMsg
                }
              >
                {msg.content}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputContainerMsg}>
        <TextInput
          style={styles.textInputMsg}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButtonMsg}>
          <Text style={styles.sendButtonTextMsg}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
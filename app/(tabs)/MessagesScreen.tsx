import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import io from 'socket.io-client';
import { useAuth } from '../_layout';
import styles from '../styles';

// Types
type Conversation = {
  user_id: number;
  first_name: string;
  last_name: string;
  last_message: string;
  last_message_time: string | null;
  has_unread: boolean;
};

export default function MessagesScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Socket.IO setup
  const socket = useMemo(() => {
    if (!user) return null;
    return io('http://localhost:5000', {
      transports: ['websocket'],
      withCredentials: true,
    });
  }, [user]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit('join', { user_id: user.id });

    socket.on('receive_message', () => {
      fetchConversations();
    });

    socket.on('message_sent', () => {
      fetchConversations();
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_sent');
      socket.disconnect();
    };
  }, [socket, user]);

  const fetchConversations = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/messages/conversations', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch conversations');
      const data: Conversation[] = await res.json();
      setConversations(data);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [user])
  );

  if (!user || loading) {
    return (
      <View style={styles.outerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <View style={styles.outerContainer}>
        <Text>No conversations yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      {conversations.map((convo) => (
        <TouchableOpacity
          key={convo.user_id}
          style={styles.conversationCard}
          onPress={() =>
            router.push({
              pathname: '../MessageScreen',
              params: {
                userId: convo.user_id.toString(),
                userName: `${convo.first_name} ${convo.last_name}`.trim(),
              },
            })
          }
        >
          <View style={styles.conversationTextWrapper}>
            <Text style={styles.conversationName}>
              {convo.first_name} {convo.last_name}
            </Text>
            <Text numberOfLines={1} style={styles.conversationMessage}>
              {convo.last_message || 'No messages yet'}
            </Text>
            {convo.last_message_time && (
              <Text style={styles.conversationTimestamp}>
                {new Date(convo.last_message_time).toLocaleString()}
              </Text>
            )}
          </View>

          {convo.has_unread && <View style={styles.blueDot} />}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
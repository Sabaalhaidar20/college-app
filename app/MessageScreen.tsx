import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

    // Create socket connection
    const socket = React.useMemo(() => {
        if (!user) return null;
        return io('http://localhost:5000', {
            transports: ['websocket'],
            withCredentials: true,
        });
    }, [user]);

    // Join room & listen for incoming messages
    useEffect(() => {
        if (!socket || !user) return;

        socket.emit('join', { user_id: user.id });

        socket.on('receive_message', (msg) => {
            // Only show messages relevant to this conversation
            if (
                (msg.sender_id === user.id && msg.receiver_id === Number(userId)) ||
                (msg.sender_id === Number(userId) && msg.receiver_id === user.id)
            ) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        // Cleanup on unmount
        return () => {
            socket.off('receive_message');
            socket.disconnect();
        };
    }, [socket, user, userId]);

    // Initial load of existing messages via HTTP fetch
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

    // Send message via socket
    const sendMessage = () => {
        if (!input.trim() || !socket || !user) return;

        const msg = {
            sender_id: user.id,
            receiver_id: Number(userId),
            content: input.trim(),
        };

        socket.emit('send_message', msg);
        setMessages((prev) => [...prev, msg]); // Optimistic UI update
        setInput('');
    };

    if (!user || loading) {
        return (
            <View style={styles.outerContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={[styles.outerContainer, { padding: 10, flex: 1 }]}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 10 }}>
                <Text style={{ color: '#007AFF', fontSize: 16 }}>{'<'} Back</Text>
            </TouchableOpacity>
            <Text style={styles.screenTitle}>Chat with {userName}</Text>
            <ScrollView
                style={{ flex: 1, marginVertical: 10 }}
                contentContainerStyle={{ paddingBottom: 10 }}
            >
                {messages.map((msg, idx) => {
                    const isMine = msg.sender_id === user.id;
                    return (
                        <View
                            key={idx}
                            style={{
                                alignSelf: isMine ? 'flex-end' : 'flex-start',
                                backgroundColor: isMine ? '#DCF8C6' : '#EEE',
                                borderRadius: 12,
                                padding: 10,
                                marginBottom: 6,
                                maxWidth: '75%',
                            }}
                        >
                            <Text>{msg.content}</Text>
                        </View>
                    );
                })}
            </ScrollView>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderTopWidth: 1,
                    borderColor: '#ccc',
                    paddingVertical: 5,
                }}
            >
                <TextInput
                    style={{
                        flex: 1,
                        height: 40,
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 20,
                        paddingHorizontal: 15,
                    }}
                    placeholder="Type a message..."
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={sendMessage}
                    returnKeyType="send"
                />
                <TouchableOpacity
                    onPress={sendMessage}
                    style={{
                        marginLeft: 8,
                        backgroundColor: '#007AFF',
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                    }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
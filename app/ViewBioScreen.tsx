import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';

export default function ViewBioScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const userId = params.userId;

    const [loading, setLoading] = useState(true);
    const [bio, setBio] = useState<any>(null);

    useEffect(() => {
        if (!userId) {
            Alert.alert('Error', 'No user ID provided');
            setLoading(false);
            return;
        }

        const fetchBio = async () => {
            try {
                const res = await fetch(`http://localhost:5000/bio/public/${userId}`);
                if (!res.ok) throw new Error('Failed to load user bio');
                const data = await res.json();
                setBio(data);
            } catch (err) {
                Alert.alert('Error', err instanceof Error ? err.message : 'Unexpected error loading bio');
            } finally {
                setLoading(false);
            }
        };
        fetchBio();
    }, [userId]);

    if (loading) {
        return (
            <View style={styles.outerContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!bio) {
        return (
            <View style={styles.outerContainer}>
                <Text>User bio not found.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={[styles.loginButtonText, { color: 'green' }]}>← Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            {/* Header row with back button and name */}
            <View style={styles.headerInline}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
                    <Text style={styles.backButtonText}>‹</Text>
                </TouchableOpacity>

                <Text style={[styles.headerTitleMsg, styles.headerTitleWithMargin]}>
                    {bio.first_name} {bio.last_name}
                </Text>
            </View>


            <View style={styles.row}>
                <Text style={styles.label}>Major:</Text>
                <Text style={styles.staticText}>{bio.major || '-'}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Graduation Year:</Text>
                <Text style={styles.staticText}>{bio.graduation_year || '-'}</Text>
            </View>

            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.tagContainer}>
                {(bio.interests || []).map((interest: string, idx: number) => (
                    <View key={idx} style={styles.tag}>
                        <Text>{interest}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Hobbies</Text>
            <View style={styles.tagContainer}>
                {(bio.hobbies || []).map((hobby: string, idx: number) => (
                    <View key={idx} style={styles.tag}>
                        <Text>{hobby}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}
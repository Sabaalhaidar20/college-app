import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../_layout';
import styles from '../styles';

export default function BioScreen() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace('/');
      return;
    }

    const fetchBio = async () => {
      try {
        const res = await fetch(`http://localhost:5000/bio/${user.id}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load bio');
        const data = await res.json();

        setName(data.first_name + ' ' + data.last_name);
        setMajor(data.major || '');
        setGradYear(data.graduation_year ? String(data.graduation_year) : '');
        setInterests(data.interests || []);
        setHobbies(data.hobbies || []);
      } catch (err) {
        Alert.alert('Error', err instanceof Error ? err.message : 'Unexpected error loading bio.');
      } finally {
        setLoading(false);
      }
    };

    fetchBio();
  }, [authLoading, user]);

  const toggleEdit = async () => {
    if (isEditing) await handleSubmit();
    setIsEditing(!isEditing);
  };

  const addItem = (type: 'interest' | 'hobby') => {
    if (type === 'interest' && interestInput.trim()) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    } else if (type === 'hobby' && hobbyInput.trim()) {
      setHobbies([...hobbies, hobbyInput.trim()]);
      setHobbyInput('');
    }
  };

  const removeItem = (type: 'interest' | 'hobby', index: number) => {
    if (type === 'interest') {
      setInterests(interests.filter((_, i) => i !== index));
    } else {
      setHobbies(hobbies.filter((_, i) => i !== index));
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const handleSubmit = async () => {
    try {
      if (!user) return;

      const body = {
        id: user.id,
        name,
        major,
        gradYear,
        interests,
        hobbies,
      };

      const response = await fetch('http://localhost:5000/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to save bio');
      Alert.alert('Success', 'Your bio was saved!');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  };

  if (loading || authLoading) {
    return (
      <View style={styles.outerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>{name}</Text>
        <TouchableOpacity onPress={toggleEdit}>
          <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Major:</Text>
        {isEditing ? (
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={major}
            onChangeText={setMajor}
            placeholder="Enter major"
          />
        ) : (
          <Text style={styles.staticText}>{major || '-'}</Text>
        )}
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Graduation Year:</Text>
        {isEditing ? (
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={gradYear}
            onChangeText={setGradYear}
            keyboardType="numeric"
            maxLength={4}
            placeholder="YYYY"
          />
        ) : (
          <Text style={styles.staticText}>{gradYear || '-'}</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>Interests</Text>
      <View style={styles.tagContainer}>
        {interests.map((item, idx) => (
          <View key={idx} style={styles.tag}>
            <Text>{item}</Text>
            {isEditing && (
              <TouchableOpacity onPress={() => removeItem('interest', idx)}>
                <Text style={styles.removeTagText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
      {isEditing && (
        <>
          <TextInput
            placeholder="Add interest"
            value={interestInput}
            onChangeText={setInterestInput}
            style={styles.input}
          />
          <TouchableOpacity style={styles.loginButton} onPress={() => addItem('interest')}>
            <Text style={styles.loginButtonText}>Add Interest</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.sectionTitle}>Hobbies</Text>
      <View style={styles.tagContainer}>
        {hobbies.map((item, idx) => (
          <View key={idx} style={styles.tag}>
            <Text>{item}</Text>
            {isEditing && (
              <TouchableOpacity onPress={() => removeItem('hobby', idx)}>
                <Text style={styles.removeTagText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
      {isEditing && (
        <>
          <TextInput
            placeholder="Add hobby"
            value={hobbyInput}
            onChangeText={setHobbyInput}
            style={styles.input}
          />
          <TouchableOpacity style={styles.loginButton} onPress={() => addItem('hobby')}>
            <Text style={styles.loginButtonText}>Add Hobby</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={[styles.loginButton, { marginTop: 30 }]} onPress={handleLogout}>
        <Text style={styles.loginButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
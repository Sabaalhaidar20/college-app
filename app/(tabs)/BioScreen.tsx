import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../_layout';

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

        setName(data.first_name + ' ' + data.last_name)
        setMajor(data.major || '');
        setGradYear(data.graduation_year ? String(data.graduation_year) : '');
        setInterests(data.interests || []);
        setHobbies(data.hobbies || []);
      } catch (err) {
        if (err instanceof Error) {
          Alert.alert('Error', err.message);
        } else {
          Alert.alert('Error', 'Unexpected error loading bio.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBio();
  }, [authLoading, user]);

  const toggleEdit = async () => {
    if (isEditing) {
      await handleSubmit();
    }
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

      if (!response.ok) {
        throw new Error('Failed to save bio');
      }

      Alert.alert('Success', 'Your bio was saved!');
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('Error', err.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  if (loading || authLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Bio</Text>
        <TouchableOpacity onPress={toggleEdit}>
          <Text style={{ color: 'blue' }}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <Text>Name</Text>
      <Text>{name}</Text>

      <Text>Major</Text>
      <TextInput value={major} onChangeText={setMajor} editable={isEditing} />

      <Text>Graduation Year</Text>
      <TextInput
        value={gradYear}
        onChangeText={setGradYear}
        keyboardType="numeric"
        maxLength={4}
        editable={isEditing}
      />

      <Text>Interests</Text>
      {interests.map((item, idx) => (
        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>{item}</Text>
          {isEditing && (
            <TouchableOpacity onPress={() => removeItem('interest', idx)}>
              <Text style={{ marginLeft: 8, color: 'red' }}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      {isEditing && (
        <View>
          <TextInput
            placeholder="Add interest"
            value={interestInput}
            onChangeText={setInterestInput}
          />
          <Button title="Add" onPress={() => addItem('interest')} />
        </View>
      )}

      <Text>Hobbies</Text>
      {hobbies.map((item, idx) => (
        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>{item}</Text>
          {isEditing && (
            <TouchableOpacity onPress={() => removeItem('hobby', idx)}>
              <Text style={{ marginLeft: 8, color: 'red' }}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      {isEditing && (
        <View>
          <TextInput
            placeholder="Add hobby"
            value={hobbyInput}
            onChangeText={setHobbyInput}
          />
          <Button title="Add" onPress={() => addItem('hobby')} />
        </View>
      )}

      <View style={{ marginTop: 40 }}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
}
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from './_layout';
import styles from './styles';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMsg('All fields are required!');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match!');
      return;
    }

    try {
      const registerResponse = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        setErrorMsg(registerData.message || 'Registration failed');
        return;
      }

      const loginResponse = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        login(loginData.user);
        router.replace('/BioScreen');
      } else {
        setErrorMsg(loginData.message || 'Login after registration failed');
      }
    } catch (err) {
      setErrorMsg('Something went wrong');
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.screenTitle}>Create Account</Text>
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            style={styles.input}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
            <Text style={styles.loginButtonText}>Register</Text>
          </TouchableOpacity>

          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : null}

          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
            <Text style={styles.registerLink}>Go back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
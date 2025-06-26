import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from './_layout';
import styles from './styles';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        router.replace('/BioScreen');
      } else {
        setErrorMsg(data.message || 'Login failed');
      }
    } catch (err) {
      setErrorMsg('Something went wrong');
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              style={styles.passwordInput}
            />
            <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
              <Text style={styles.showHideButton}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : null}

          <Text style={styles.registerPrompt}>
            New user?{' '}
            <Text
              style={styles.registerLink}
              onPress={() => router.push('/RegisterScreen')}
            >
              Create account
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
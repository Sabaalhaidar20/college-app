import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:5000/hello")
    .then((res)=> res.json())
    .then((data)=> setMessage(data.message))
    .catch((err)=> setMessage("Error: " + err.message));
  }, []);

  return (
    <View>
      <Text>This is a message from Frontend!!!</Text>
      <Text>{message}</Text>
    </View>
  );
}

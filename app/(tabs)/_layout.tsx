import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="SearchScreen" options={{ title: "Search" }} />
      <Tabs.Screen name="MessagesScreen" options={{ title: "Messages" }} />
      <Tabs.Screen name="BioScreen" options={{ title: "Profile" }} />
      <Tabs.Screen
        name="ActivitySchedulingScreen"
        options={{ title: "Activity" }}
      />
      <Tabs.Screen
        name="SupportScreen"
        options={{ title: "Support" }}
      />
    </Tabs>
  );
}
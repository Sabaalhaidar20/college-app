import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="SearchScreen" options={{ title: 'Search' }} />
      <Tabs.Screen name="MessagesScreen" options={{ title: 'Messages' }} />
      <Tabs.Screen name="BioScreen" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
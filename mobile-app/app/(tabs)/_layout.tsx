import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#D4AF37', // Gold
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: 'rgba(212, 175, 55, 0.2)',
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false, // Hide default header to let our custom UI shine
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="planet-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Styles',
          tabBarIcon: ({ color }) => <TabBarIcon name="color-palette-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}

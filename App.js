import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AppProvider, useApp } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import RoutesScreen from './src/screens/RoutesScreen';
import RouteDetailsScreen from './src/screens/RouteDetailsScreen';
import StopsScreen from './src/screens/StopsScreen';
import StopDetailsScreen from './src/screens/StopDetailsScreen';
import TripFinderScreen from './src/screens/TripFinderScreen';
import StopPickerScreen from './src/screens/StopPickerScreen';
import SavedScreen from './src/screens/SavedScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerOptions = {
  headerStyle: { backgroundColor: colors.ink },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '800' },
  headerShadowVisible: false,
};

const TAB_ICONS = {
  Home: 'compass',
  Routes: 'bus',
  Stops: 'location',
  Trip: 'swap-horizontal',
  Saved: 'bookmark',
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...headerOptions,
        tabBarActiveTintColor: colors.plate,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: { backgroundColor: colors.ink, borderTopColor: colors.inkSoft },
        tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
        tabBarIcon: ({ color, size }) => <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Routes" component={RoutesScreen} options={{ title: 'Bus routes' }} />
      <Tab.Screen name="Stops" component={StopsScreen} options={{ title: 'Bus stops' }} />
      <Tab.Screen name="Trip" component={TripFinderScreen} options={{ title: 'Trip finder' }} />
      <Tab.Screen name="Saved" component={SavedScreen} options={{ title: 'Saved' }} />
    </Tab.Navigator>
  );
}

function Root() {
  const { ready } = useApp();
  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ink }}>
        <ActivityIndicator size="large" color={colors.plate} />
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={headerOptions}>
        <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="RouteDetails" component={RouteDetailsScreen} options={{ title: 'Route' }} />
        <Stack.Screen name="StopDetails" component={StopDetailsScreen} options={{ title: 'Stop' }} />
        <Stack.Screen
          name="StopPicker"
          component={StopPickerScreen}
          options={({ route }) => ({
            title: route.params.field === 'fromId' ? 'Choose starting stop' : 'Choose destination',
            presentation: 'modal',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <Root />
      </AppProvider>
    </SafeAreaProvider>
  );
}

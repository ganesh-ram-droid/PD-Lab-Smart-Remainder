import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import routes from '../constants/routes';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();

const getIconName = (routeName, focused) => {
  const icons = {
    [routes.HOME]: focused ? 'home' : 'home-outline',
    [routes.PROFILE]: focused ? 'person' : 'person-outline',
    [routes.SETTINGS]: focused ? 'settings' : 'settings-outline'
  };

  return icons[routeName];
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopColor: '#E2E8F0'
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600'
        },
        tabBarIcon: ({ color, size, focused }) => (
          <Icon name={getIconName(route.name, focused)} size={size} color={color} />
        )
      })}
    >
      <Tab.Screen name={routes.HOME} component={HomeScreen} />
      <Tab.Screen name={routes.PROFILE} component={ProfileScreen} />
      <Tab.Screen name={routes.SETTINGS} component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

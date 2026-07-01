import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import routes from '../constants/routes';
import BottomTabNavigator from './BottomTabNavigator';
import ReminderListScreen from '../screens/Reminder/ReminderListScreen';
import ReminderDetailsScreen from '../screens/Reminder/ReminderDetailsScreen';
import AddReminderScreen from '../screens/Reminder/AddReminderScreen';
import EditReminderScreen from '../screens/Reminder/EditReminderScreen';
import MapScreen from '../screens/Map/MapScreen';
import SelectLocationScreen from '../screens/Map/SelectLocationScreen';
import NearbyRemindersScreen from '../screens/Map/NearbyRemindersScreen';
import GeofenceScreen from '../screens/Map/GeofenceScreen';
import ContextDashboardScreen from '../screens/Context/ContextDashboardScreen';
import NotificationCenterScreen from '../screens/Notifications/NotificationCenterScreen';
import NotificationDetailsScreen from '../screens/Notifications/NotificationDetailsScreen';
import NotificationSettingsScreen from '../screens/Notifications/NotificationSettingsScreen';
import AnalyticsDashboardScreen from '../screens/Analytics/AnalyticsDashboardScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import PrivacyScreen from '../screens/Profile/PrivacyScreen';
import AboutScreen from '../screens/Profile/AboutScreen';
import HelpScreen from '../screens/Profile/HelpScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.MAIN_TABS} component={BottomTabNavigator} />
      <Stack.Screen name={routes.REMINDERS} component={ReminderListScreen} />
      <Stack.Screen name={routes.ADD_REMINDER} component={AddReminderScreen} />
      <Stack.Screen name={routes.EDIT_REMINDER} component={EditReminderScreen} />
      <Stack.Screen name={routes.REMINDER_DETAILS} component={ReminderDetailsScreen} />
      <Stack.Screen name={routes.MAPS} component={MapScreen} />
      <Stack.Screen name={routes.SELECT_LOCATION} component={SelectLocationScreen} />
      <Stack.Screen name={routes.NEARBY_REMINDERS} component={NearbyRemindersScreen} />
      <Stack.Screen name={routes.GEOFENCE} component={GeofenceScreen} />
      <Stack.Screen name={routes.CONTEXT_DASHBOARD} component={ContextDashboardScreen} />
      <Stack.Screen name={routes.NOTIFICATIONS} component={NotificationCenterScreen} />
      <Stack.Screen name={routes.NOTIFICATION_DETAILS} component={NotificationDetailsScreen} />
      <Stack.Screen name={routes.NOTIFICATION_SETTINGS} component={NotificationSettingsScreen} />
      <Stack.Screen name={routes.ANALYTICS} component={AnalyticsDashboardScreen} />
      <Stack.Screen name={routes.ANALYTICS_DASHBOARD} component={AnalyticsDashboardScreen} />
      <Stack.Screen name={routes.PROFILE_EDIT} component={EditProfileScreen} />
      <Stack.Screen name={routes.PRIVACY} component={PrivacyScreen} />
      <Stack.Screen name={routes.ABOUT} component={AboutScreen} />
      <Stack.Screen name={routes.HELP} component={HelpScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

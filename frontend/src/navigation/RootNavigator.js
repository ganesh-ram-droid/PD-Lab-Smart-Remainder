import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Loader from '../components/common/Loader';
import routes from '../constants/routes';
import useAuth from '../hooks/useAuth';
import SplashScreen from '../screens/Splash/SplashScreen';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { initializing, isAuthenticated } = useAuth();

  if (initializing) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer fallback={<Loader message="Preparing app..." />}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name={routes.APP} component={AppNavigator} />
        ) : (
          <Stack.Screen name={routes.AUTH} component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

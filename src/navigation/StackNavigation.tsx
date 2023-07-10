import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { screens } from '../screens';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Welcome'
        component={screens.Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='BluetoothPairing'
        component={screens.BluetoothPairing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Home'
        component={screens.Home}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name='GamePad'
        component={screens.GamePad}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
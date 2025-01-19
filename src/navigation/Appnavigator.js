import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import NoteDetail from '../NoteDetail';
import { BottomTabs } from './BottomTabs';
import SignUpScreen from '../auth/SignUpScreen';
import SplashScreen from '../SplashScreen';
import LogoutScreen from '../auth/LogoutScreen';
import LoginScreen from '../auth/LoginScreen';

const Stack = createNativeStackNavigator();

export default function Appnavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen 
          name="Main" 
          component={BottomTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="NoteDetail" 
          component={NoteDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SplashScreen" 
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="LogoutScreen" 
          component={LogoutScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
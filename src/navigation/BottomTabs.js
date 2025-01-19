import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Categories from '../Categories';
import Components from '../Components';
import HomeScreen from '../HomeScreen';
import StudyTimer from '../StudyTimer';
import LogoutScreen from '../auth/LogoutScreen';

const Tab = createBottomTabNavigator();

const COLORS = {
  dark: '#333333',
  orangeIcon: "#F63E38"
};

export const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'calendar';
          } else if (route.name === 'Components') {
            iconName = 'clockcircleo';
          } else if (route.name === 'Categories') {
            iconName = 'appstore-o';
          }
           else if (route.name === 'LogoutScreen') {
            iconName = 'bars';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: COLORS.orangeIcon,
        tabBarInactiveTintColor: COLORS.dark,
        tabBarStyle: {
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          height: 70,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.15,
          shadowRadius: 3.5,
          elevation: 5
        },
        tabBarItemStyle: {
          paddingVertical: 7,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '500',
        },
        headerShown: false,
        tabBarBackground: () => (
          <View style={{ 
            backgroundColor: "#FFF6F5",
            // borderTopLeftRadius: 25,
            // borderTopRightRadius: 25,
            height: '100%',
            borderWidth: 1,
          }}/>
        ),
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Components}
        options={{
          tabBarLabel: 'Calendar',
        }}
      />
      <Tab.Screen 
        name="Components" 
        component={StudyTimer}
        options={{
          tabBarLabel: 'Timer',
        }}
      />
      <Tab.Screen 
        name="Categories" 
        component={Categories}
        options={{
          tabBarLabel: 'Categories',
        }}
      />
      <Tab.Screen 
        name="LogoutScreen" 
        component={LogoutScreen}
        options={{
          tabBarLabel: 'More',
        }}
      />
    </Tab.Navigator>
  );
};
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Classify } from './screens/Classify'
import { Guidebook } from './screens/Guidebook'

function GuidebookScreen() {
  return (
    <Guidebook></Guidebook>
  );
}

function IdentifyScreen() {
  return (
    <Classify></Classify>
  )
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Guide') {
            iconName = focused ? 'book-sharp' : 'book-outline';
          } else if (route.name === 'Identify') {
            iconName = focused ? 'search-sharp' : 'search-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#546747',
        inactiveTintColor: 'gray',
      }}
      >
        <Tab.Screen name="Guide" component={GuidebookScreen} />
        <Tab.Screen name="Identify" component={IdentifyScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
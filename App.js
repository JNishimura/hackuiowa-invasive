import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

function MapScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Map!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Guide" component={GuidebookScreen} />
        <Tab.Screen name="Identify" component={IdentifyScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
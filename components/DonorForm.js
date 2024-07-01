import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AddDonor from './AddDonorForm';
import AddDonor2 from './AddDonorForm2';
import AddDonor3 from './AddDonorForm3';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const DonorFormStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Step1">
        <Stack.Screen name="Donor Details" component={AddDonor}/>
        <Stack.Screen name="Enter Donation Details" component={AddDonor2}/>
        <Stack.Screen name="Enter Donation Details " component={AddDonor3}/>
        <Stack.Screen name="home" component={HomeScreen} options={{ headerShown: false }}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default DonorFormStackNavigator;

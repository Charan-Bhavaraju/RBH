import React from 'react';
import Screen from '../screens/Screens';


export const Home = ({navigation}) => <Screen navigation={navigation} screen='home' />
export const AddChild = ({navigation}) => <Screen navigation={navigation} screen='addChild' />
export const ViewChild = ({navigation}) => <Screen navigation={navigation} screen='viewChild' />
export const AddDonor = ({navigation}) => <Screen navigation={navigation} screen='addDonor' />
// export const AddDonor2 = ({navigation}) => <Screen navigation={navigation} screen='addDonor2' />
// export const AddDonor3 = ({navigation}) => <Screen navigation={navigation} screen='addDonor3' />
export const SearchDonor = ({navigation}) => <Screen navigation={navigation} screen='searchDonor' />
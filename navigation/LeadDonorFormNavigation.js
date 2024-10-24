import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation'
import {React} from 'react';
import LeadDonor1 from '../components/LeadDonorForm1';
import LeadDonor2 from '../components/LeadDonorForm2';
import LeadDonor3 from '../components/LeadDonorForm3';
import LeadDonor4 from '../components/LeadDonorForm4';
import LeadEditForm from '../components/LeadEditForm';
import HomeScreen from '../screens/HomeScreen';

const screens = {
    LeadDonor1: {
        screen: LeadDonor1,
        navigationOptions: () => ({
          title: 'Add Lead',
        }),
    },
    LeadDonor2: {
        screen: LeadDonor2,
        navigationOptions: () => ({
          title: 'Add Lead',
        }),
    },
    LeadDonor3: {
      screen: LeadDonor3,
      navigationOptions: () => ({
        title: 'Add Lead',
      })},
    LeadDonor4: {
      screen: LeadDonor4,
      navigationOptions: () => ({
        title: 'Add Lead',
      })
    },
    LeadEditForm: {
      screen: LeadEditForm,
      navigationOptions: () => ({
        title: 'Edit Lead',
      })
    }
}

const LeadDonorFormStackNavigator = createStackNavigator(screens, {
    defaultNavigationOptions: {
    headerStyle: {
      height: 50
    },
    safeAreaInsets: { top: 0 }
  }})

export default createAppContainer(LeadDonorFormStackNavigator);
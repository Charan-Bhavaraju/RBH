import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation'
import {React} from 'react';
import AddDonor from '../components/AddDonorForm';
import AddDonor2 from '../components/AddDonorForm2';
import AddDonor3 from '../components/AddDonorForm3';
import HomeScreen from '../screens/HomeScreen';

const screens = {
    AddDonor: {
        screen: AddDonor,
        navigationOptions: () => ({
          title: 'Donor Details',
        }),
    },
    AddDonor2: {
        screen: AddDonor2,
        navigationOptions: () => ({
          title: 'Enter Donation Details',
        }),
    },
    AddDonor3: {
      screen: AddDonor3,
      navigationOptions: () => ({
        title: 'Enter Donation Details',
      }),
    }
}

const DonorFormStackNavigator = createStackNavigator(screens, {
    defaultNavigationOptions: {
    headerStyle: {
      height: 50
    },
    safeAreaInsets: { top: 0 }
  }})

export default createAppContainer(DonorFormStackNavigator)
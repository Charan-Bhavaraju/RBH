import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation'
import {React} from 'react';
import SearchDonor from '../components/SearchDonor'
import AddDonor from '../components/AddDonorForm';
import IndividualContribution1 from '../components/IndividualContributionForm1';
import IndividualContribution2 from '../components/IndividualContributionForm2';
import HomeScreen from '../screens/HomeScreen';

const screens = {
    SearchDonor: {
        screen: SearchDonor,
        navigationOptions: () => ({
          title: 'Search Donor',
        }),
    },
    AddDonor: {
        screen: AddDonor,
        navigationOptions: () => ({
          title: 'Donor Details',
        }),
    },
    IndividualContribution1: {
        screen: IndividualContribution1,
        navigationOptions: () => ({
          title: 'Enter Donation Details',
        }),
    },
    IndividualContribution2: {
      screen: IndividualContribution2,
      navigationOptions: () => ({
        title: 'Enter Donation Details',
      }),
    }
}

const SearchDonorFormStackNavigator = createStackNavigator(screens, {
    defaultNavigationOptions: {
    headerStyle: {
      height: 50
    },
    safeAreaInsets: { top: 0 }
  }})

export default createAppContainer(SearchDonorFormStackNavigator)
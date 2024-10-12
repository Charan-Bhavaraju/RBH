import React, { Component } from 'react';
import { Text } from 'react-native';
import HomeScreen from './HomeScreen';
import ChildList from "../components/ChildList";
import Test from "../components/Test";
import StackNavigation from '../navigation/StackNavigation';
import AddChild from '../components/AddChildForm'
import AddDonor from '../components/AddDonorForm';
import IndividualContribution1 from '../components/IndividualContributionForm1';
import IndividualContribution2 from '../components/IndividualContributionForm2';
import DonorFormStackNavigator from '../navigation/DonorFormNavigation';
import SearchDonorFormStackNavigator from '../navigation/SearchDonorFormNavigation';
import SearchDonor from '../components/SearchDonor';
import AddChildNavigation from '../navigation/AddChildNavigation';
import LeadDonorFormNavigation from '../navigation/LeadDonorFormNavigation';

export default class PresentScreen extends Component {

    render() {
        if (this.props.screen === 'home') {
            return <HomeScreen navigation={this.props.navigation} />;
        }
        else if (this.props.screen === 'addChild') {
            return <AddChild navigation={this.props.navigation} />;
        }
        else if (this.props.screen === 'viewChild') {
            return <StackNavigation screenProps={this.props.navigation} />;
        }
        else if (this.props.screen === 'addDonor') {
            return <DonorFormStackNavigator screenProps={this.props.navigation} />;
        }        
        else if (this.props.screen === 'leadDonor') {
            return <LeadDonorFormNavigation screenProps={this.props.navigation} />;
        }
        else if (this.props.screen === 'searchDonor') {
            return <SearchDonorFormStackNavigator screenProps={this.props.navigation} />;
        }
        else if (this.props.screen === 'report') {
            return <Text>Report Screen</Text>;
        }
    }
}


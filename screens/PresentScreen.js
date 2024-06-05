import React, { Component } from 'react';
import { Text } from 'react-native';
import HomeScreen from './HomeScreen';
import ChildList from "../components/ChildList";
import Test from "../components/Test";
import StackNavigation from '../navigation/StackNavigation';
import AddChild from '../components/AddChildForm'
import AddDonor from '../components/AddDonorForm';
import AddDonor3 from '../components/AddDonorForm3';
import SearchDonor from '../components/SearchDonor';
import AddChildNavigation from '../navigation/AddChildNavigation';

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
            return <AddDonor screenProps={this.props.navigation} />;
        }
        else if (this.props.screen === 'addDonor3') {
            return <AddDonor3 screenProps={this.props.navigation} />;
        }
        else if (this.props.screen === 'searchDonor') {
            return <SearchDonor screenProps={this.props.navigation} />;
        }
        else if (this.props.screen === 'report') {
            return <Text>Report Screen</Text>;
        }
    }
}


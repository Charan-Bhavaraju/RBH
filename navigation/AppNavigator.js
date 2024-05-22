import React from 'react'
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Home, AddChild, ViewChild, AddDonor, Report, LoginScreen, SearchDonor } from './Navigation';
import {Feather} from '@expo/vector-icons';
import SideBar from '../components/SideBar';


const DrawerNavigator = createDrawerNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            title: "Home",
            drawerIcon: ({tintColor}) => <Feather name="home" size={20} color={tintColor}/>
        }
    },
    AddChild: {
        screen: AddChild,
        navigationOptions: {
            title: "Add Child",
            drawerIcon: ({tintColor}) => <Feather name="user-plus" size={20} color={tintColor}/>
        }
    },
    ViewChild: {
        screen: ViewChild,
        navigationOptions: {
            title: "View/Update Child",
            drawerIcon: ({tintColor}) => <Feather name="users" size={20} color={tintColor}/>
        }
    },
    AddDonor: {
        screen: AddDonor,
        navigationOptions: {
            title: "Donate",
            drawerIcon: ({tintColor}) => <Feather name="users" size={20} color={tintColor}/>
        }
    },
    SearchDonor: {
        screen: SearchDonor,
        navigationOptions: {
            title: "Search Donor",
            drawerIcon: ({tintColor}) => <Feather name="users" size={20} color={tintColor}/>
        }
    }
}, {
    contentComponent: props => <SideBar {...props} />
});


export default createAppContainer(DrawerNavigator);


import React from 'react'
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Home, AddChild, ViewChild, AddDonor, Report, LoginScreen, SearchDonor, AddDonor3, AddDonor2} from './Navigation';
import {Feather} from '@expo/vector-icons';
import SideBar from '../components/SideBar';
import { FontAwesome5 } from '@expo/vector-icons';


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
            drawerIcon: ({tintColor}) => <FontAwesome5 name="donate" size={24} color="black" />
        }
    },    
    // AddDonor2: {
    //     screen: AddDonor2,
    //     navigationOptions: {
    //         title: "AddDonor2",
    //         drawerIcon: ({tintColor}) => <Feather name="users" size={20} color={tintColor}/>
    //     }
    // },
    // AddDonor3: {
    //     screen: AddDonor3,
    //     navigationOptions: {
    //         title: "AddDonor3",
    //         drawerIcon: ({tintColor}) => <Feather name="users" size={20} color={tintColor}/>
    //     }
    // },
    SearchDonor: {
        screen: SearchDonor,
        navigationOptions: {
            title: "Search Donor",
            drawerIcon: ({tintColor}) => <Feather name="search" size={20} color={tintColor}/>
        }
    }
}, {
    contentComponent: props => <SideBar {...props} />
});


export default createAppContainer(DrawerNavigator);


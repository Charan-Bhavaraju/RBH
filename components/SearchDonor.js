import React, {useState} from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView , Image, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Feather} from '@expo/vector-icons';
import {Formik} from 'formik';
import {globalStyles} from '../styles/global';
import * as ImagePicker from 'expo-image-picker';
import * as yup from 'yup';
import moment from 'moment';
import { TouchableHighlight } from 'react-native-gesture-handler';
import {base_url,getDataAsync} from '../constants/Base';
import { ActivityIndicator } from 'react-native';
import { getOrgId, getHomeCode } from '../constants/LoginConstant';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import * as Permissions from 'expo-permissions';
import {guidGenerator} from '../constants/Base';
import {buildTestImageName, buildProdImageName} from '../constants/ChildConstants';
import base64 from 'react-native-base64';
import {getPassword, getUserName} from '../constants/LoginConstant';


export default class SearchDonor extends React.Component {

    state = {
        showLoader: false,
        loaderIndex: 0,
        searchType: 3,
        isVisible: false,
        sucessDisplay: false,
        errorDisplay: false,
        pageOne: true,
        pageTwo: true,
        pageThree: true,
        currentPage: 1,
        submitButtonDisabled: false,
        donorsList: []
    };

    onSelectedDonorChange = selectedDonor => {
        this.setState({ selectedDonor : selectedDonor });
    };

    // API call to search sponsors
    fetchDonors = async (inputDonor) => {
        // console.warn(inputDonor);
        const searchUrl = `${base_url}/sponsors/donor?search=${inputDonor}`;

        let result = await fetch(searchUrl);

        result = await result.json()
        
        if (result) {
            let dataItems = result
            this.setState({ donorsList: dataItems});
            console.log(result);
        }
    };

    componentDidMount() {
        let orgId = getOrgId();
        this.setState({orgid: orgId});
        let homeCode = getHomeCode();
        this.setState({homecode: homeCode});
        console.log(this.state.homeCode);
    }

    _changeSearchType = (value, handleChange) => {
        this.setState({searchType: value});
        console.log(value);
        handleChange(value);
    }

    render() {

        const radio_props = [
            {
                label: 'Individual',
                value: '1',
            },
            {
                label: 'Lead',
                value: '2',
            },
            {
                label: 'Corporate donation',
                value: '3',
            }
        ];
        
        return (
            <View style = {globalStyles.container}>
                

                <Formik
                initialValues = {
                    {
                        DonorName: '',
                        SearchType: 1,
                    }
                }
                >
                    {props => (
                        <KeyboardAvoidingView behavior="null"
                                                    enabled style={globalStyles.keyboardavoid}
                                                    keyboardVerticalOffset={0}>
                        <View style={{ position: 'absolute', top:"45%",right: 0, left: 0, zIndex: this.state.loaderIndex }}>
                            <ActivityIndicator animating={this.state.showLoader} size="large" color="red" />
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style= {globalStyles.topView}>
                                {this.state.pageOne && <View>
                                    <View style={{position: 'absolute', top: "40%", right: 0, left:0, zIndex: -2,}}>
                                        <Image source = {require("../assets/RBHlogoicon.png")} style={{resizeMode: 'cover',opacity: 0.2, marginTop: '30%', marginLeft: '29%'}}/>
                                    </View>
                                
                                {/* Search */}
                                <View style={{marginTop: '5%', marginLeft: '5%', marginRight: '5%'}}>
                                    <Text>Search Type:{'\n'}</Text>
                                    <RadioForm
                                            style={{marginLeft: 10}}
                                            radio_props={radio_props}
                                            buttonSize={10}
                                            buttonOuterSize={20}
                                            buttonColor={'black'}
                                            buttonInnerColor={'black'}
                                            selectedButtonColor={'blue'}
                                            formHorizontal={false}
                                            onPress={(value) => this._changeSearchType(value,props.handleChange('SearchType'))}
                                    />
                                    <Text style = {globalStyles.errormsg}>{props.touched.SearchType && props.errors.SearchType}</Text>
                                    
                                    <View style={{marginTop: '5%'}}>
                                        {/* Search Donor */}
                                        <TextInput
                                            placeholder='Enter Donor name / Donor id'
                                            style = {globalStyles.inputText}
                                            onChangeText = {(searchInput) => {
                                                this.fetchDonors(searchInput);
                                                props.handleChange('DonorName')(searchInput);
                                                }
                                            }
                                            // value = {props.values.DonorName}
                                        />
                                        {
                                            this.state.donorsList.length ? 
                                            this.state.donorsList.map((item) =>
                                            <View>
                                                <Text>{item.sponsorName}</Text>    
                                            </View>)
                                            :null
                                        }
                                    </View>
                                    
                                    
                                </View>
                                
                                <Text style = {globalStyles.errormsg}>{props.touched.DonorName && props.errors.DonorName}</Text>

                        
                                </View>
                                }
                            </View>


                    <View style = {globalStyles.homescreenButtonStyle}>
                        <View style = {{padding: 20}}>
                            <Button style={globalStyles.addChildBtn} title='Add Child' onPress={() => this.props.navigation.navigate('AddChild',{navigation: this.props.navigation, updateStats: this.updateStats.bind(this)})}></Button>
                        </View>
                    </View>
                        </ScrollView>  
                        </KeyboardAvoidingView>
                                                  
                    )}

                </Formik>
            </View>
        );
    }
}
import React from 'react';
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


export default class SearchDonor extends React.Component{

    
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

    componentDidMount() {
        let orgId = getOrgId();
        this.setState({orgid: orgId});
    }

    _searchDonorForm(values) {
        console.log("searchDonor called");
        let request_body = JSON.stringify({
            "donorName": values.DonorName,
            "searchType": values.SearchType,
        });
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
                                    <View style={globalStyles.backgroundlogoimageview}>
                                        <Image source = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
                                    </View>
                                
                                {/* Search */}
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
                                
                                {/* Search Donor */}
                                <TextInput
                                    placeholder='Donor name / Donor id'
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('DonorName')}
                                    value = {props.values.DonorName}
                                />
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
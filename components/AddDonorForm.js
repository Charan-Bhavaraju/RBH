import React, { Component } from 'react';
import MultiSelect from 'react-native-multiple-select';

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


const AddDonorSchema = yup.object({
    DonorID: yup.string(),
    DonorName: yup.string().required(),
    DonorType: yup.string().required(),
    Source: yup.string().required(),
    PhoneNumber: yup.string().required().length(10, 'Phonenumber must be 10 digits long'),
    Email: yup.string().required(),
    PAN: yup.string().required()
});

let imagePath = null;
const defaultImg = require('../assets/person.png');

//const items = [
//    {
//    id: '92iijs7yta',
//    name: 'Ondo'
//  }, {
//    id: 'a0s0a8ssbsd',
//    name: 'Ogun'
//  }, {
//    id: '16hbajsabsd',
//    name: 'Calabar'
//  }, {
//    id: 'nahs75a5sg',
//    name: 'Lagos'
//  }, {
//    id: '667atsas',
//    name: 'Maiduguri'
//  }, {
//    id: 'hsyasajs',
//    name: 'Anambra'
//  }, {
//    id: 'djsjudksjd',
//    name: 'Benue'
//  }, {
//    id: 'sdhyaysdj',
//    name: 'Kaduna'
//  }, {
//    id: 'suudydjsjd',
//    name: 'Abuja'
//    }
//];


export default class AddDonor extends React.Component{

    state = {
        loaderIndex: 0,
        showLoader: false,
        donortypes: [],
        sources: [],
        isVisible: false,
        sucessDisplay: false,
        errorDisplay: false,
        pageOne: true,
        pageTwo: true,
        pageThree: true,
        currentPage: 1,
        submitButtonDisabled: false,
        openSourceDropDown: false,
        items: []
        selectedItems : []
    };

    fetchItemsData() {
         axios.get(`https://jsonplaceholder.typicode.com/users`)
              .then(res => {
                const dataItems = res.data;
                 this.setState({ items: dataItems});
              })
    }

    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
      };

    async addDonorConstants(){
        // getDataAsync(base_url + '/donortypes').then(data => { this.setState({religions: data})});
        let donortypesdata = [{'DonorTypeId' : 1, 'DonorType': 'Government'},{'DonorTypeId' : 2, 'DonorType': 'Civil Society'}]
        this.setState({donortypes: donortypesdata})

        // getDataAsync(base_url + '/sources').then(data => { this.setState({communities: data})});
//        let sourcesdata =[{'SourceId' : 1, 'Source': 'City'},{'SourceId' : 2, 'Source': 'Government'},{'SourceId' : 3, 'Source': 'State'},{'SourceId' : 4, 'Source': 'Home'},{'SourceId' : 5, 'Source': 'Organization'},{'SourceId' : 6, 'Source': 'Individual'}]
//
//        this.setState({setStateources: [{ 'label': 'Item 1', 'Source': 'item1' }]})
    }



    loadStats(){
        getDataAsync(base_url + '/dashboard/' + getOrgId())
            .then(data => {
                let stats = [] 
                for(let i = 0; i < data.length; i++){
                    stats.push([data[i].statusValue, data[i].total])
                }
                this.props.navigation.state.params.updateStats(stats)
             })
    }

    modalclickOKSuccess = () => {
        this.props.navigation.goBack();
    }

    modalclickOKError = () => {
        this.setState({isVisible: false});
    }

    componentDidMount() {
        let orgId = getOrgId();
        this.setState({orgid: orgId});
        this.addDonorConstants();
        this.fetchItemsData();
    }

    openDropDown = () => {
        this.setState({
             openSourceDropDown: !this.state.openSourceDropDown
        })
    }
    setSources = () => {
            this.setState({
                 sources: this.items
            })

            console.log('TESTTSTST--->',this.state.openSourceDropDown)
        }

    _submitAddDonorForm(values) {
        console.log("submitdonor called");
        let request_body = JSON.stringify({
            "DonorName": values.DonorName,
            "DonorType": values.DonorType,
            "Source": values.Source,
            "PhoneNumber": values.PhoneNumber,
            "Email": values.Email,
            "PAN": values.PAN
        });
        console.log(request_body);
    }


    render() {
        const { selectedItems } = this.state;

        return (
            <View style = {globalStyles.container}>
                
                <Formik
                initialValues = {
                    {
                        DonorID: '',
                        DonorName: '',
                        DonorType: '',
                        Source: '',
                        PhoneNumber: '',
                        Email: '',
                        PAN:''
                    }
                }
                validationSchema = {AddDonorSchema}
                onSubmit = {async (values, actions) => {
                    // this.setState({showLoader: true,loaderIndex:10});
                    this.setState({submitButtonDisabled: true});
                    let result = this._submitAddDonorForm(values);
                    let alertMessage = this.state.submitAlertMessage;
                    console.log(result);
                    this.setState({submitButtonDisabled: false});
                    this.props.navigation.navigate('Enter Donation Details');
                }}
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
                                
                                <View style={globalStyles.PageHeaderView}>
                                    <Text style={globalStyles.PageHeader}>Add New Donor</Text>
                                </View>

                                {/* Donor Name */}
                                <Text style = {globalStyles.label}>Donor Name <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('DonorName')}
                                    value = {props.values.DonorName}
                                    placeholder="Donor Name"
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.DonorName && props.errors.DonorName}</Text>


                                {/* Donor Type */}
                                <Text style = {globalStyles.label}>Donor Type <Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.DonorType}
                                    onValueChange = {value => {
                                        props.setFieldValue('DonorType', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Donor Type' color='grey' value = ''/>
                                    { 
                                        this.state.donortypes.map((item) => {
                                            return <Picker.Item key = {item.DonorTypeId} label = {item.DonorType} value = {item.DonorTypeId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.DonorType && props.errors.DonorType}</Text>
                                
                                
                                
                                {/* Source */}
                                <Text style = {globalStyles.label}>Source <Text style={{color:"red"}}>*</Text> :</Text>
                                <MultiSelect
                                          hideTags
                                          items={items}
                                          uniqueKey="id"
                                          ref={(component) => { this.multiSelect = component }}
                                          onSelectedItemsChange={this.onSelectedItemsChange}
                                          selectedItems={selectedItems}
                                          selectText="Pick Items"
                                          searchInputPlaceholderText="Search Items..."
                                          onChangeInput={ (text)=> console.log(text)}
                                          altFontFamily="ProximaNova-Light"
                                          tagRemoveIconColor="#CCC"
                                          tagBorderColor="#CCC"
                                          tagTextColor="#CCC"
                                          selectedItemTextColor="#CCC"
                                          selectedItemIconColor="#CCC"
                                          itemTextColor="#000"
                                          displayKey="name"
                                          searchInputStyle={{ color: '#CCC' }}
                                          submitButtonColor="#CCC"
                                          submitButtonText="Submit"
                                        />
                                <Text style = {globalStyles.errormsg}>{props.touched.Source && props.errors.Source}</Text>
                                

                                {/* Phone Number */}
                                <Text style = {globalStyles.label}>Phone Number <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('PhoneNumber')}
                                    value = {props.values.PhoneNumber}
                                    placeholder="Phone Number"
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.PhoneNumber && props.errors.PhoneNumber}</Text>
                                
                                {/* Email */}
                                <Text style = {globalStyles.label}>Email <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('Email')}
                                    value = {props.values.Email}
                                    placeholder='Email'
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.Email && props.errors.Email}</Text>
                                 
                                {/* PAN */}
                                <Text style = {globalStyles.label}> PAN <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('PAN')}
                                    value = {props.values.PAN}
                                    placeholder='PAN'
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.PAN && props.errors.PAN}</Text>
                                                                                                


                                <Button style = {globalStyles.button} title="ADD DONOR" onPress={props.handleSubmit} disabled={this.state.submitButtonDisabled}/>
                                </View>}
                            </View>
                        </ScrollView>  
                        </KeyboardAvoidingView>
                                                  
                    )}

                </Formik>
            </View>
        );
    }
}
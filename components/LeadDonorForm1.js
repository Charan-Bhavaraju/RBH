import React, { Component } from 'react';

import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView , Image, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {Formik} from 'formik';
import {globalStyles} from '../styles/global';
import * as yup from 'yup';
import {base_url,getDataAsync} from '../constants/Base';
import { ActivityIndicator } from 'react-native';
import {getPassword, getUserName} from '../constants/LoginConstant';
import { getSelectedDonor, setSelectedDonor } from '../constants/DonorConstants';


const AddDonorSchema = yup.object({
    DonorID: yup.string(),
    DonorName: yup.string(),//.required(),
    DonorType: yup.string(),//.required(),
    Source: yup.string(),//.required(),
    PhoneNumber: yup.string(),//.required().length(10, 'Phonenumber must be 10 digits long'),
    Email: yup.string(),//.required().email('Please enter a valid email address'),
    PAN: yup.string()//.required().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN card format')
});

export default class LeadDonor1 extends React.Component{
    constructor(props){
        super(props)
    this.state ={
        fromSearchFlag: false, 
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
        donorDetails: "",
        openSourceDropDown: false,
        selectedDonorDetails: getSelectedDonor()
    };
    }

    async addDonorConstants(){
        console.log(this.state.selectedDonorDetails)
        if(Object.keys(this.state.selectedDonorDetails).length !== 0){
            // coming from search donor screen
            console.log("coming from search screen")
            this.setState({fromSearchFlag: true})
            this.setState({donortypes: this.state.selectedDonorDetails.donorType})
            let sourcesdata =[{'SourceId' : 1, 'Source': 'City'},{'SourceId' : 2, 'Source': 'Government'},{'SourceId' : 3, 'Source': 'State'},{'SourceId' : 4, 'Source': 'Home'},{'SourceId' : 5, 'Source': 'Organization'},{'SourceId' : 6, 'Source': 'Individual'}]
            this.setState({sources: sourcesdata})
        }else {
        console.log("coming from add donor screen")

        getDataAsync(base_url + '/donorType')
                    .then(data => {
                        let donorTypesData = []
                        for(let i = 0; i < data.length; i++){
                            donorTypesData.push({
                                      'id': data[i].id,
                                      'donorTypeName': data[i].donorTypeName,
                                    });
                        }
                         this.setState({donortypes: donorTypesData})
                     })


        let sourcesdata =[{'SourceId' : 1, 'Source': 'City'},{'SourceId' : 2, 'Source': 'Government'},{'SourceId' : 3, 'Source': 'State'},{'SourceId' : 4, 'Source': 'Home'},{'SourceId' : 5, 'Source': 'Organization'},{'SourceId' : 6, 'Source': 'Individual'}]
        this.setState({sources: sourcesdata})
//        getDataAsync(base_url + '/donorType')
//                            .then(data => {
//                                let sourceData = []
//                                for(let i = 0; i < data.length; i++){
//                                    sourceData.push({
//                                              'SourceId': data[i].id,
//                                              'Source': data[i].donorTypeName,
//                                            });
//                                }
//                                this.setState({sources: sourceData})
//                             })
        }
    }



    componentDidMount() {
        console.log('mounting component');
        this.addDonorConstants();
    }


    async _submitAddDonorForm(values) {
        console.log("submitdonor called");
        let request_body = JSON.stringify({
            "DonorName": values.DonorName,
            "DonorType": values.DonorType,
            "Source": values.Source,
            "PhoneNumber": values.PhoneNumber,
            "Email": values.Email,
            "PAN": values.PAN,
            "fromSearchFlag": this.state.fromSearchFlag,
            "sponsorNo": this.state.selectedDonorDetails.sponsorNo
        });
        console.log(getUserName(), getPassword());
        this.setState({donorDetails: request_body})
    }

    render() {
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
                    this._submitAddDonorForm(values);
                    let alertMessage = this.state.submitAlertMessage;
                    this.setState({submitButtonDisabled: false});
                    this.props.navigation.navigate('LeadDonor2', {donorDetails: this.state.donorDetails});
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
                                { this.state.fromSearchFlag ===false ?
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('DonorName')}
                                    value = {props.values.DonorName}
                                    placeholder="Donor Name"
                                />
                                :
                                <TextInput
                                style = {globalStyles.inputText}
                                value={this.state.selectedDonorDetails.sponsorName}
                                editable={false}
                                selectTextOnFocus={false}
                                />          
                                }                                
                                <Text style = {globalStyles.errormsg}>{props.touched.DonorName && props.errors.DonorName}</Text>


                                {/* Donor Type */}
                                <Text style = {globalStyles.label}>Donor Type <Text style={{color:"red"}}>*</Text> :</Text>
                                { this.state.fromSearchFlag ===false ?
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
                                            return <Picker.Item key = {item.id} label = {item.donorTypeName} value = {item.id}/>
                                        })
                                    }
                                </Picker>
                                :
                                <TextInput
                                    style = {globalStyles.inputText}
                                    value={this.state.donortypes.donorTypeName}
                                    editable={false}
                                    selectTextOnFocus={false}
                                    />          
                                }
                                <Text style = {globalStyles.errormsg}>{props.touched.DonorType && props.errors.DonorType}</Text>
                                
                                
                                
                                {/* Source */}
                                <Text style = {globalStyles.label}>Source <Text style={{color:"red"}}>*</Text> :</Text>
                                { this.state.fromSearchFlag ===false ?
                                <Picker
                                    selectedValue = {props.values.Source}
                                    onValueChange = {value => {
                                        props.setFieldValue('Source', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Source' color='grey' value = ''/>
                                    {
                                        this.state.sources.map((item) => {
                                            return <Picker.Item key = {item.SourceId} label = {item.Source} value = {item.SourceId}/>
                                        })
                                    }
                                </Picker>
                                :
                                <TextInput
                                style = {globalStyles.inputText}
                                value={this.state.sources}
                                editable={false}
                                selectTextOnFocus={false}
                                />          
                                }
                                <Text style = {globalStyles.errormsg}>{props.touched.Source && props.errors.Source}</Text>
                                

                                {/* Phone Number */}
                                <Text style = {globalStyles.label}>Phone Number <Text style={{color:"red"}}>*</Text> :</Text>
                                { this.state.fromSearchFlag ===false ?
                                <TextInput
                                    keyboardType="numeric"
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('PhoneNumber')}
                                    value = {props.values.PhoneNumber}
                                    placeholder="Phone Number"
                                />
                                : 
                                <TextInput
                                style = {globalStyles.inputText}
                                value={this.state.selectedDonorDetails.mobileNo}
                                editable={false}
                                selectTextOnFocus={false}
                                />          
                                }
                                <Text style = {globalStyles.errormsg}>{props.touched.PhoneNumber && props.errors.PhoneNumber}</Text>
                                
                                {/* Email */}
                                <Text style = {globalStyles.label}>Email <Text style={{color:"red"}}>*</Text> :</Text>
                                { this.state.fromSearchFlag ===false ?
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('Email')}
                                    value = {props.values.Email}
                                    placeholder='Email'
                                />
                                : 
                                <TextInput
                                style = {globalStyles.inputText}
                                value={this.state.selectedDonorDetails.emailId}
                                editable={false}
                                selectTextOnFocus={false}
                                />          
                                }
                                <Text style = {globalStyles.errormsg}>{props.touched.Email && props.errors.Email}</Text>
                                 
                                {/* PAN */}
                                <Text style = {globalStyles.label}> PAN <Text style={{color:"red"}}>*</Text> :</Text>
                                { this.state.fromSearchFlag ===false ?
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('PAN')}
                                    value = {props.values.PAN}
                                    placeholder='PAN'
                                    autoCapitalize="characters" 
                                />
                                : 
                                <TextInput
                                style = {globalStyles.inputText}
                                value={this.state.selectedDonorDetails.panNumber}
                                editable={false}
                                selectTextOnFocus={false}
                                />          
                                }
                                <Text style = {globalStyles.errormsg}>{props.touched.PAN && props.errors.PAN}</Text>
                                                                                                  
                                <Button style = {globalStyles.button} title= { this.state.fromSearchFlag ===false ? "ADD DONOR":"Continue"} onPress={props.handleSubmit} disabled={this.state.submitButtonDisabled}/>
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
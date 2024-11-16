import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView , Image, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
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
import { getOrgId, getHomeCode, getOrgLevelId, getRainbowHome } from '../constants/LoginConstant';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import * as Permissions from 'expo-permissions';
import {guidGenerator} from '../constants/Base';
import {buildTestImageName, buildProdImageName} from '../constants/ChildConstants';
import base64 from 'react-native-base64';
import {getPassword, getUserName} from '../constants/LoginConstant';

const LeadDonorSchema2 = yup.object({
    POCName: yup.string().required(),
    Gender: yup.string().required(),
    Designation: yup.string().required(),
    Email: yup.string().required().email('Please enter a valid email address'),
    PhoneNumber: yup.string().required().length(10, 'Phonenumber must be 10 digits long'),
});

export default class LeadDonor2 extends React.Component{
    constructor(props) {
        super(props);
    }

    state = {
        loaderIndex: 0,
        showLoader: false,
        genders: [],
        isVisible: false,
        pageOne: true,
        currentPage: 1,
        submitButtonDisabled: false,
        pocDetails: "",
        homesVisible: false,

    };

    async addLeadConstants(){

        getDataAsync(base_url + '/gender')
            .then(data => {
                let genderData = []
                for(let i = 0; i < data.length; i++){
                    genderData.push({
                                'GenderId': data[i].genderID,
                                'Gender': data[i].gender,
                            });
                }
                    this.setState({genders: genderData})
                })
        // let gendersdata =[{'GenderId' : 1, 'Gender': 'Male'},{'GenderId' : 2, 'Gender': 'Female'},{'GenderId' : 3, 'Gender': 'Transgender'}]
        // this.setState({genders: gendersdata})
    }

    modalclickOKSuccess = () => {
        this.props.navigation.goBack();
    }

    modalclickOKError = () => {
        this.setState({isVisible: false});
    }

    componentDidMount() {
        console.log("Mounting Data")
        this.addLeadConstants();
    }

    _pickDd = (event,date,handleChange) => {
        if(event["type"] == "dismissed") {

        }
        else {
            let a = moment(date).format('YYYY-MM-DD');
            this.setState({donationdate:a, showdd: false});
            handleChange(a);
        }
    }

    resetdatesandradio() {
        this.setState({specialdaydate:''});
    }

    showDatepickerDD = () => {
        this.setState({showdd: true});
    };

    _submitPocDetailsForm(values) {
        console.log("Props", this.props.navigation.state.params.orgDetails)
        console.log("Lead Poc Details ");

        let request_body = JSON.stringify({
            "POCName": values.POCName,
            "Gender": values.Gender,
            "Designation": values.Designation,
            "Email": values.Email,
            "PhoneNumber": values.PhoneNumber
        });
        console.log(request_body);
        this.setState({pocDetails: request_body})
    }

    

    render() {
        const { selectedCities, selectedHomes } = this.state;
        return (
            <View style = {globalStyles.container}>
                
                <Formik
                initialValues = {
                    {
                        POCName : '',
                        Gender : '',
                        Designation: '',
                        Email: '',
                        PhoneNumber: ''
                    }
                }
                validationSchema = {LeadDonorSchema2}
                onSubmit = {async (values, actions) => {
                    // this.setState({showLoader: true,loaderIndex:10});
                    this.setState({submitButtonDisabled: true});
                    let result = this._submitPocDetailsForm(values);
                    console.log(result);
                    this.setState({submitButtonDisabled: false});
                    this.props.navigation.navigate('LeadDonor3', {orgDetails: this.props.navigation.state.params.orgDetails, pocDetails: this.state.pocDetails});
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
                                        <Image PaymentMode = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
                                    </View>
                                
                                <Text style={globalStyles.headerText}>Point of Contact Details</Text>
                                
                                {/* Point of contact Name */}
                                <Text style = {globalStyles.label}>Point of contact Name <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput

                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('POCName')}
                                    value = {props.values.POCName}
                                    placeholder='Point of Contact Name'

                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.POCName && props.errors.POCName}</Text>


                                {/* Gender */}
                                <Text style = {globalStyles.label}>Gender<Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.Gender}
                                    onValueChange = {value => {
                                        props.setFieldValue('Gender', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Gender' color='grey' value = ''/>
                                    { 
                                        this.state.genders.map((item) => {
                                            return <Picker.Item key = {item.GenderId} label = {item.Gender} value = {item.GenderId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.Gender && props.errors.Gender}</Text>


                                {/* Designation */}
                                <Text style = {globalStyles.label}>Designation <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput

                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('Designation')}
                                    value = {props.values.Designation}
                                    placeholder='Designation'

                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.Designation && props.errors.Designation}</Text>
                                
                                {/* Email */}
                                <Text style = {globalStyles.label}>Email <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('Email')}
                                    value = {props.values.Email}
                                    placeholder='Email'
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.Email && props.errors.Email}</Text>        


                                {/* Phone Number */}
                                <Text style = {globalStyles.label}> Phone Number <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('PhoneNumber')}
                                    value = {props.values.PhoneNumber}
                                    placeholder="Phone Number"
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.PhoneNumber && props.errors.PhoneNumber}</Text>

                                <Button style = {globalStyles.button} title="Next" onPress={props.handleSubmit} disabled={this.state.submitButtonDisabled}/>
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
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

const AddDonorSchema3 = yup.object({
    InkindItem: yup.string(),//.required(),
    BudgetedFromDonation: yup.string(),//.required(),
    UnBudgetedFromDonation: yup.string(),//.required(),
    DonationReason: yup.string(),//.required(),
    DonationAdditionalNotes: yup.string(),//.required(),
    SpecialDayDate: yup.string(),//.required(),
    PurposeOfDonation: yup.string(),//.required(),
    DonorPreference: yup.string(),//.required()
});

let imagePath = null;

const defaultImg = require('../assets/person.png');

export default class AddDonor extends React.Component{

    state = {
        loaderIndex: 0,
        showLoader: false,
        inkinditems: [],
        donationreasons: [],
        purposeofdonation: [],
        specialdaydate: '',
        showsdd: false,
        donorpreference: 2,
        isVisible: false,
        sucessDisplay: false,
        errorDisplay: false,
        pageOne: true,
        pageTwo: true,
        pageThree: true,
        currentPage: 1,
        submitButtonDisabled: false,
    };


    async addDonorConstants(){
        // getDataAsync(base_url + '/inkinditems').then(data => { this.setState({religions: data})});
        let inkinditemsdata = [{'InkindItemId' : 1, 'InkindItem': 'Food'},{'InkindItemId' : 2, 'InkindItem': 'Clothes'}]
        this.setState({inkinditems: inkinditemsdata})

        // getDataAsync(base_url + '/donationreasons').then(data => { this.setState({communities: data})});
        let donationreasonsdata =[{'DonationReasonId' : 1, 'DonationReason': 'Self Birthday'},{'DonationReasonId' : 2, 'DonationReason': 'Wedding Anniversary'},{'DonationReasonId' : 3, 'DonationReason': 'Festival'},{'DonationReasonId' : 4, 'DonationReason': 'Just wanted to donate'}]
        this.setState({donationreasons: donationreasonsdata})

        // getDataAsync(base_url + '/purposeofdonation').then(data => { this.setState({communities: data})});
        let purposeofdonationdata =[{'PurposeOfDonationId' : 1, 'PurposeOfDonation': 'General'},{'PurposeOfDonationId' : 2, 'PurposeOfDonation': 'Education'},{'PurposeOfDonationId' : 3, 'PurposeOfDonation': 'Health'},{'PurposeOfDonationId' : 4, 'PurposeOfDonation': 'Sports'}]
        this.setState({purposeofdonation: purposeofdonationdata})
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
    }
    _pickSdd = (event,date,handleChange) => {
        if(event["type"] == "dismissed") {

        }
        else {
            let a = moment(date).format('YYYY-MM-DD');
            this.setState({specialdaydate:a, showsdd: false});
            handleChange(a);
        }
    }

    _alertUser() {
        Alert.alert("Success", "Donation Added Successfully", [{ text: "OK" , onPress: () => this.props.navigation.navigate('AddDonor')}],
        {cancelable: false},);
    }

    resetdatesandradio() {
        this.setState({specialdaydate:''});
        this.setState({donorpreference: 2});
    }

    showDatepickerSDD = () => {
        this.setState({showsdd: true});
    };

    _changeDonorPreference = (value, handleChange) => {
        this.setState({donorpreference: value});
        console.log(value);
        handleChange(value);
    }

    _submitAddDonorForm(values) {
        console.log("submitdonor called");
        console.log("Props", this.props.navigation.state.params.donorDetails, this.props.navigation.state.params.contributionPage1)

        // call add donor
        // get user info

        let request_body = JSON.stringify({
            "InkindItem": values.InkindItem,
            "BudgetedFromDonation": values.BudgetedFromDonation,
            "UnBudgetedFromDonation": values.UnBudgetedFromDonation,
            "DonationReason": values.DonationReason,
            "DonationAdditionalNotes": values.DonationAdditionalNotes,
            "SpecialDayDate": values.SpecialDayDate,
            "PurposeOfDonation": values.PurposeOfDonation,
            "DonorPreference": values.DonorPreference
        });
        console.log(request_body);
        // var imageupload = false;
        // fetch(base_url+"/child", {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
        //     },
        //     body: request_body,
        // })
        // .then((response) =>{
        //     if(response.ok) {
        //         console.log("printing status");
        //         console.log(response.status);
        //         console.log("printing status");
        //         response.json().then((responseJson) => {
        //             let DonorId = responseJson.childNo;
        //             let childName = responseJson.DonorName;
        //             this.loadStats();
        //             let imageUri = '';
        //             if(imagePath === null) {
        //                 imageUri= ''
        //             }
        //             else {
        //                 imageUri = imagePath;
        //             }
        //             console.log("Image URI");
        //             console.log(imageUri);
        //             console.log("Image URI");
        //             let imageName = buildTestImageName(responseJson.childNo, responseJson.DonorName);
        //             let photoUrl = base_url+"/upload-image/"+responseJson.childNo + imageName;
        //             console.log(photoUrl);
        //             var formdata = new FormData();
        //             formdata.append('file', { uri: imageUri, name: `${imageName.split('/')[2]}.jpg`, type: 'image/jpg' });
        //             fetch(photoUrl, {
        //                 method: 'PUT',
        //                 headers: {
        //                     'content-type': 'multipart/form-data;boundary=----WebKitFormBoundaryyEmKNDsBKjB7QEqu',
        //                     'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
        //                 },
        //                 body: formdata,
        //             })
        //             .then((response) => {
        //                 console.log("*****");
        //                 console.log(response.status);
        //                 console.log("******");
        //                 if(response.status == 200) {
        //                             this.state.photoUploadMessage = ". Succesfully uploaded image";
        //                             imageupload = true;
        //                 }
        //                 else {
        //                             this.state.photoUploadMessage = ". Error uploading image";
        //                 }
        //                 this.setState({submitAlertMessage: 'Successfully added Child '+childName+' in '+getHomeCode()+ this.state.photoUploadMessage});
        //                 Alert.alert(
        //                             'Added Child',
        //                             this.state.submitAlertMessage,
        //                             [
        //                                 { text: 'OK', onPress: () => this.props.navigation.goBack() },
        //                             ],
        //                             { cancelable: false },
        //                 ); 
        //                 this.setState({isVisible: true, errorDisplay: true});
        //                 this.setState({showLoader: false,loaderIndex:0});
        //             })
        //             .catch((error)=> {
        //                 this.state.photoUploadMessage = ".Error uploading image";
        //                 this.setState({submitAlertMessage: 'Successfully added Child '+childName+' in '+getHomeCode()+ this.state.photoUploadMessage});
        //                 Alert.alert(
        //                     'Added Child',
        //                     this.state.submitAlertMessage,
        //                     [
        //                         { text: 'OK', onPress: () => this.props.navigation.goBack() },
        //                     ],
        //                     { cancelable: false },
        //                 );
        //                 this.setState({isVisible: true, errorDisplay: true});
        //                 this.setState({showLoader: false,loaderIndex:0});
        //             })
        //         })
        //     }
        //     else {
        //         if(response.status == 500) {
        //             response.json().then((responseJson) => {
        //                 console.log(responseJson)
        //                 if(responseJson.message == "Duplicate profile") {
        //                     this.setState({submitAlertMessage: 'Unable to add child. Plesae contact the Admin.'});
        //                     Alert.alert(
        //                         'Failed To Add Child',
        //                         responseJson.message+". Child already present.",
        //                         [
        //                             { text: 'OK', onPress: () => console.log("Failed to add child") },
        //                         ],
        //                         { cancelable: false },
        //                     );
        //                     this.setState({isVisible: true, errorDisplay: true});
        //                     this.setState({showLoader: false,loaderIndex:0});
        //                 }
        //             })
        //         }
        //         else {
        //             throw Error(response.status);
        //         }
        //     }
        // })
        // .catch((error) => {
        //     this.setState({submitAlertMessage: 'Unable to add child. Plesae contact the Admin.'});
        //     Alert.alert(
        //         'Failed To Add Child',
        //         this.state.submitAlertMessage,
        //         [
        //             { text: 'OK', onPress: () => console.log("Failed to add child") },
        //         ],
        //         { cancelable: false },
        //     );
        //     this.setState({isVisible: true, errorDisplay: true});
        //     this.setState({showLoader: false,loaderIndex:0});
        // });
    }

    render() {
        const radio_props = [
            {
                label: 'Send Thank You SMS',
                value: '1',
            },
            {
                label: 'Send Thank You SMS and Receipt',
                value: '2',
            }
        ];

        return (
            <View style = {globalStyles.container}>
                
                <Formik
                initialValues = {
                    {
                        InkindItem: '',
                        BudgetedFromDonation: '',
                        UnBudgetedFromDonation: '',
                        DonationReason: '',
                        DonationAdditionalNotes: '',
                        SpecialDayDate: this.state.specialdaydate,
                        PurposeOfDonation:'',
                        DonorPreference:1
                    }
                }
                validationSchema = {AddDonorSchema3}
                onSubmit = {async (values, actions) => {
                    // this.setState({showLoader: true,loaderIndex:10});
                    this.setState({submitButtonDisabled: true});
                    let result = this._submitAddDonorForm(values);
                    let alertMessage = this.state.submitAlertMessage;
                    console.log(result);
                    this.setState({submitButtonDisabled: false});
                    this._alertUser()
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

                           

                                {/* Inkind Item  */}
                                <Text style = {globalStyles.label}>Inkind Item <Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.InkindItem}
                                    onValueChange = {value => {
                                        props.setFieldValue('InkindItem', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Inkind Item' color='grey' value = ''/>
                                    { 
                                        this.state.inkinditems.map((item) => {
                                            return <Picker.Item key = {item.InkindItemId} label = {item.InkindItem} value = {item.InkindItemId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.DonorType && props.errors.DonorType}</Text>
                                
                                {/* Budgeted from donation */}
                                <Text style = {globalStyles.label}>Budgeted from donation <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('BudgetedFromDonation')}
                                    value = {props.values.BudgetedFromDonation}z
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.BudgetedFromDonation && props.errors.BudgetedFromDonation}</Text>

                                {/* Un-Budgeted from donation */}
                                <Text style = {globalStyles.label}>UnBudgeted from donation<Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('UnBudgetedFromDonation')}
                                    value = {props.values.UnBudgetedFromDonation}
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.UnBudgetedFromDonation && props.errors.UnBudgetedFromDonation}</Text>      

                                <Text style={{textAlignVertical: "center",textAlign: "right",}}>Total: {Number(props.values.BudgetedFromDonation) + Number(props.values.UnBudgetedFromDonation)}</Text>
                                
                                {/* Donation Reason */}
                                <Text style = {globalStyles.label}>Donation Reason <Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.DonationReason}
                                    onValueChange = {value => {
                                        props.setFieldValue('DonationReason', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='DonationReason' color='grey' value = ''/>
                                    {
                                        this.state.donationreasons.map((item) => {
                                            return <Picker.Item key = {item.DonationReasonId} label = {item.DonationReason} value = {item.DonationReasonId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.DonationReason && props.errors.DonationReason}</Text>
                                

                                {/* Donation Additional Notes */}
                                <Text style = {globalStyles.label}>Donation Additional Notes <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('DonationAdditionalNotes')}
                                    value = {props.values.DonationAdditionalNotes}
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.DonationAdditionalNotes && props.errors.DonationAdditionalNotes}</Text>

                                {/* Special Day Date */}
                                <Text style = {globalStyles.label}>Special Day Date<Text style={{color:"red"}}>*</Text> :</Text>
                                <View style={globalStyles.dobView}>
                                    <TextInput
                                        style = {globalStyles.inputText, globalStyles.dobValue}
                                        value = {this.state.specialdaydate}
                                        editable = {false}
                                        onValueChange = {props.handleChange('SpecialDayDate')}
                                    />
                                    <TouchableHighlight onPress={this.showDatepickerSDD}>
                                        <View>
                                            <Feather style={globalStyles.dobBtn}  name="calendar"/>
                                        </View>
                                    </TouchableHighlight>
                                    {/* <Button style= {globalStyles.dobBtn} onPress={this.showDatepicker} title="Select DOB" /> */}
                                    {this.state.showsdd && 
                                        <DateTimePicker
                                            style={{width: 200}}
                                            mode="date" //The enum of date, datetime and time
                                            value={ new Date() }
                                            mode= { 'date' }
                                            onChange= {(e,date) => this._pickSdd(e,date,props.handleChange('SpecialDayDate'))} 
                                        />
                                    }
                                </View>
                                <Text style = {globalStyles.errormsg}>{props.touched.SpecialDayDate && props.errors.SpecialDayDate}</Text>

                                {/* Purpose Of Donation */}
                                <Text style = {globalStyles.label}>Purpose Of Donation<Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.PurposeOfDonation}
                                    onValueChange = {value => {
                                        props.setFieldValue('PurposeOfDonation', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Purpose Of Donation' color='grey' value = ''/>
                                    {
                                        this.state.purposeofdonation.map((item) => {
                                            return <Picker.Item key = {item.PurposeOfDonationId} label = {item.PurposeOfDonation} value = {item.PurposeOfDonationId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.PurposeOfDonation && props.errors.PurposeOfDonation}</Text>
                                                                                                
                                {/* Donor Preference */}
                                <Text style = {globalStyles.label}>Donor Preference <Text style={{color:"red"}}>*</Text> :</Text>
                                {/* <Picker
                                    selectedValue = {props.values.Gender}
                                    onValueChange = {props.handleChange('Gender')}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Gender' value = ''/>
                                    <Picker.Item label='Male' value = '1'/>
                                    <Picker.Item label='Female' value = '2'/>
                                </Picker> */}
                                <RadioForm
                                        style={{marginLeft: 10}}
                                        radio_props={radio_props}
                                        buttonSize={10}
                                        buttonOuterSize={20}
                                        buttonColor={'black'}
                                        buttonInnerColor={'black'}
                                        selectedButtonColor={'blue'}
                                        formHorizontal={false}
                                        onPress={(value) => this._changeDonorPreference(value,props.handleChange('DonorPreference'))}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.DonorPreference && props.errors.DonorPreference}</Text>



                                <Button style = {globalStyles.button} title="Submit" onPress={props.handleSubmit} disabled={this.state.submitButtonDisabled}/>
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
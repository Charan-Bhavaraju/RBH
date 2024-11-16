import React from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, Picker, Image, TouchableOpacity, KeyboardAvoidingView,ScrollView } from 'react-native';

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
import { getOrgId, getHomeCode, getOrgLevelId, getRainbowHome, getUserId } from '../constants/LoginConstant';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import {guidGenerator} from '../constants/Base';
import {buildTestImageName, buildProdImageName} from '../constants/ChildConstants';
import base64 from 'react-native-base64';
import {getPassword, getUserName} from '../constants/LoginConstant';

const FollowUpSchema = yup.object({
    FollowUpDate : yup.string(),
    mode: yup.string(),//.required(),
    assignedTo: yup.string(),//.required(),
    Remarks: yup.string(),//.required(),
});

let imagePath = null;

const defaultImg = require('../assets/person.png');

export default class LeadDonor3 extends React.Component{
    constructor(props) {
        super(props);
    }

    state = {
        loaderIndex: 0,
        showLoader: false,
        pageOne: true,
        currentPage: 1,
        submitButtonDisabled: false,
        modes : [],
        assignedTos : [],
        leadNo: '',
        orgid : 0,
        isFollowUp: false,
        assignedTo: '',
        followUpDate: new Date(),
        showDatePicker: false,
        mode: '',
        remarks: '',
        leadFollowupDetails : ''
    };

    // Toggle follow-up switch
    toggleSwitch = () => {
        this.setState(prevState => ({ isFollowUp: !prevState.isFollowUp }));
    };



    async _submitAddLeadFollowupForm(values) {
        console.log("submit followup called");

        let request_body = JSON.stringify({
            "assignedTo": values.assignedTo,
            "followUpDate": values.FollowUpDate,
            "modeId": values.mode,
            "remarks": values.Remarks,
            "leadNo": this.props.navigation.state.params.leadNo
          });
        // let request_body = JSON.stringify( { assignedTo, followUpDate, mode, remarks, leadNo:this.props.navigation.state.params.leadNo });
        console.log(request_body);
        this.setState({leadFollowupDetails: request_body})

        const response = await fetch(base_url+"/add-followup", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
            },
            body: request_body,
        })
        if(response.ok) {
            const responseJson = await response.json()
            console.log("Followup Created")
        }
        return response;

    }


    async addLeadConstants(){
        getDataAsync(base_url + '/get-assigned-to/'+getUserId())
        .then(data => {
            let assignedTosdata = []
            for(let i = 0; i < data.length; i++){
                assignedTosdata.push({
                          'id': data[i].userId,
                          'assignedTo': data[i].userName,
                        });
            }
             this.setState({assignedTos: assignedTosdata})
         })
    //    let assignedTosdata = [{'id' : 1, 'assignedTo': 'CCI'},{'id' : 2, 'assignedTo': 'CBC-RCCLC'},{'id' : 3, 'assignedTo': 'Residential Hostels'}]
    //    this.setState({assignedTos: assignedTosdata})

        getDataAsync(base_url + '/follow-up-mode')
        .then(data => {
            let modeData = []
            for(let i = 0; i < data.length; i++){
                modeData.push({
                          'id': data[i].followUpModeId,
                          'mode': data[i].followUpModeName,
                        });
            }
             this.setState({modes: modeData})
         })
        // let modeData = [{'id' : 1, 'mode': 'CCI'},{'id' : 2, 'mode': 'CBC-RCCLC'},{'id' : 3, 'mode': 'Residential Hostels'}]
        // this.setState({modes: modeData})
    }


    componentDidMount() {
        console.log("Mounting Data")
        console.log(this.state.orgid)
        this.addLeadConstants();
    }


    resetdatesandradio() {
        this.setState({specialdaydate:''});
    }

    
    _failureAlertUser() {
        console.log("Alert")
        Alert.alert("Failure", "Failed to create the lead", [{ text: "OK" , onPress: () => this.props.navigation.navigate('LeadDonor1')}],
        {cancelable: false},);
    }


    _pickDate = (event,date,handleChange) => {
        if(event["type"] == "dismissed") {

        }
        else {
            let a = moment(date).format('YYYY-MM-DD');
            this.setState({followUpDate:a, showDatePicker: false});
            handleChange(a);
        }
    }

    // Show date picker
    showDatepicker = () => {
        this.setState({ showDatePicker: true });
    };

    render() {
        return (
            <View style = {globalStyles.container}>
                
                <Formik
                initialValues = {
                    {
                        FollowUpDate: this.state.toDate,
                        mode: '',
                        Remarks: '',
                        assignedTo: ""
                    }
                }
                validationSchema = {FollowUpSchema}
                onSubmit = {async (values, actions) => {
                    // this.setState({showLoader: true,loaderIndex:10});
                    this.setState({submitButtonDisabled: true});
                    let result = await this._submitAddLeadFollowupForm(values);
                    let alertMessage = this.state.submitAlertMessage;
                    if(result==='failed'){
                        await this._failureAlertUser()
                    }
                    else {
                        console.log('navigating')
                        this.props.navigation.navigate('LeadEditForm', {leadNo: this.props.navigation.state.params.leadNo, leadDonationDetails: this.props.navigation.state.params.leadDonationDetails});
                    }
                    // this.setState({submitButtonDisabled: false});
                    // this.props.navigation.navigate('EditLead', {leadNo: this.props.navigation.state.params.leadNo});

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
                                
                                <View style={styles.container}>
                                {/* Success Icon */}
                                <View style={styles.iconContainer}>
                                    <Image
                                        source={require('../assets/success.png')} // Path to your success icon
                                        style={styles.successIcon}
                                    />
                                </View>

                                {/* Lead Successfully Created Message */}
                                <Text style={styles.successMessage}>Lead successfully created!</Text>
                                <Text style={styles.subMessage}>Here is the lead no created for your reference</Text>

                                {/* Lead Number */}
                                <Text style={styles.leadNumber}>Lead No.: {this.props.navigation.state.params.leadNo}</Text>


                                </View>


                                {/* Lead Brought By Input */}
                                <Text style = {globalStyles.label}>Lead Brought By:<Text style={{color:"red"}}>*</Text> :</Text>

                                <TextInput
                                    style={globalStyles.inputText}
                                    placeholder="Lead Brought By*"
                                    value={getUserName()} // Pre-filled example
                                    editable={false} // Non-editable if it's a fixed value
                                />

                                {/* Company Logo */}
                                {/* Toggle Switch */}
                                <View style={styles.switchContainer}>
                                <Text style={styles.label}>Do you want to add follow up?</Text>
                                <Switch
                                    value={this.state.isFollowUp}
                                    onValueChange={this.toggleSwitch}
                                    thumbColor={this.state.isFollowUp ? '#fff' : '#f4f3f4'}
                                    trackColor={{ false: '#767577', true: '#007AFF' }} // Blue color for active switch
                                />   
                                </View>    


                            {/* Conditionally Render Follow-up Fields */}
                            {this.state.isFollowUp && (
                                <>
                                {/* Assigned To Header */}

                                <Text style = {globalStyles.label}>Assigned to<Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.assignedTo}
                                    onValueChange = {value => {
                                        props.setFieldValue('assignedTo', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Assigned To' color='grey' value = ''/>
                                    { 
                                        this.state.assignedTos.map((item) => {
                                            return <Picker.Item key = {item.id} label = {item.assignedTo} value = {item.id}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.assignedTo && props.errors.assignedTo}</Text>
                                
                                {/* Follow Up Date */}
                                <Text style = {globalStyles.label}>Follow Up Date<Text style={{color:"red"}}>*</Text> :</Text>
                                <View style={globalStyles.dobView}>
                                    <TextInput
                                        style = {{...globalStyles.inputText, ...globalStyles.dobValue}}
                                        value = {`${moment(this.state.followUpDate).format('YYYY-MM-DD')}`}
                                        editable = {false}
                                        onValueChange = {props.handleChange('FollowUpDate')}
                                    />
                                    <TouchableHighlight onPress={this.showDatepicker}>
                                        <View>
                                            <Feather style={globalStyles.dobBtn}  name="calendar"/>
                                        </View>
                                    </TouchableHighlight>
                                    {/* <Button style= {globalStyles.dobBtn} onPress={this.showDatepicker} title="Select DOB" /> */}
                                    {this.state.showDatePicker && 
                                        <DateTimePicker
                                            style={{width: 200}}
                                            value={ new Date() }
                                            mode= { 'date' }
                                            onChange= {(e,date) => this._pickDate(e,date,props.handleChange('FollowUpDate'))} 
                                        />
                                    }
                                </View>
                                <Text style = {globalStyles.errormsg}>{props.touched.FollowUpDate && props.errors.FollowUpDate}</Text>

                                {/* Mode */}

                                <Text style = {globalStyles.label}>Mode<Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.mode}
                                    onValueChange = {value => {
                                        props.setFieldValue('mode', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Mode' color='grey' value = ''/>
                                    { 
                                        this.state.modes.map((item) => {
                                            return <Picker.Item key = {item.id} label = {item.mode} value = {item.id}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.mode && props.errors.mode}</Text>
                                
                                {/* Remarks */}
                                <Text style = {globalStyles.label}>Remarks <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('Remarks')}
                                    value = {props.values.Remarks}
                                    placeholder='Remarks'
                                    multiline={true}
                                    numberOfLines={2}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.Remarks && props.errors.Remarks}</Text>
                                

                                </>
                            )}



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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 20,
    },
    successIcon: {
        width: 80,
        height: 80,
    },
    successMessage: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subMessage: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    leadNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6A0DAD',
        marginBottom: 30,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    pickerInput: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        justifyContent: 'center',
        marginBottom: 20,
        borderRadius: 5,
    },
    followUpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    followUpText: {
        fontSize: 16,
    },
    button: {
        height: 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    inputWrapper: {
        width: '100%',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 5,
    },
});

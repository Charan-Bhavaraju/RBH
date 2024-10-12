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

const IndividualContributionSchema1 = yup.object({
    City: yup.string(),
    Home: yup.string(),
    DonationDate: yup.string(),//.required(),
    ProgramType: yup.string(),//.required(),
    PaymentMode: yup.string(),//.required(),
    Amount: yup.string(),//.required(),
    Quantity: yup.string()//.required()
});

let imagePath = null;

const defaultImg = require('../assets/person.png');

export default class IndividualContribution1 extends React.Component{
    constructor(props) {
        super(props);
    }

    state = {
        loaderIndex: 0,
        showLoader: false,
        programtypes: [],
        paymentmodes: [],
        donationdate: '',
        City : getRainbowHome()['city'],
        Home : getRainbowHome()['rhName'],
        showdd: false,
        isVisible: false,
        sucessDisplay: false,
        errorDisplay: false,
        pageOne: true,
        pageTwo: true,
        pageThree: true,
        currentPage: 1,
        submitButtonDisabled: false,
        contributionPage1: "",
        cities: [],
        homes : [],
        selectedCities : [],
        selectedHomes : [],
        homesVisible: false,
        orgLevel : getOrgLevelId(),
        rainbowHome : getRainbowHome(),
        orgid : 0
    };
    
    // componentDidUpdate(prevProps, prevState) {
    //     // Check if 'count' has changed
    //     if (prevState.selectedCities !== this.state.selectedCities && this.state.selectedCities.length >0){
    //         this.setState({ homesVisible :true });
    //     };
    //     if (this.state.selectedCities.length ===0){
    //         this.setState({ homesVisible :false });
    //     };
    // }
    fetchItemsData() {
        let orgLevel = getOrgLevelId();
        console.log(orgLevel, getRainbowHome().stateNetworkNo)
        if(orgLevel === 5){
            console.log("User Org Level is 5")
            getDataAsync(base_url + `/stateNetwork/${getRainbowHome().stateNetworkNo}`).then(res => {
                let dataItems = res;
                this.setState({ cities: [dataItems]});
                console.log(cities);
            })
            this.setState({ homes: [getRainbowHome()]});
        }
        else {        
            console.log("User Org Level is <5 ")

            getDataAsync(base_url + '/stateNetwork').then(res => {
                let dataItems = res;
                console.log(res)
                this.setState({ cities: dataItems});
              })
            
        }

        // console.log(this.state.cities, this.state.homes)
    };


    onSelectedCitiesChange = selectedCities => {
        this.setState({ selectedCities :selectedCities });
        this.setState({ homesVisible :true });
        const queryParams = selectedCities
        .map(city => `stateNetworkNos=${city}`) // Extract stateNetworkNo
        .join('&'); // Join them with '&'

        getDataAsync(base_url + '/homes?' +queryParams).then(res => {
            let dataItems = res;
            this.setState({ homes: dataItems});
        }).catch(error => {
            console.error('Error fetching data:', error);
        });

      };

    onSelectedHomesChange = selectedHomes => {
        this.setState({ selectedHomes :selectedHomes });
      };

    async addDonorConstants(){
        // getDataAsync(base_url + '/programtypes').then(data => { this.setState({religions: data})});
//        let programtypesdata = [{'ProgramTypeId' : 1, 'ProgramType': 'CCI'},{'ProgramTypeId' : 2, 'ProgramType': 'CBC-RCCLC'},{'ProgramTypeId' : 3, 'ProgramType': 'Residential Hostels'}]
//        this.setState({programtypes: programtypesdata})
        getDataAsync(base_url + '/programType')
                            .then(data => {
                                let programTypeData = []
                                for(let i = 0; i < data.length; i++){
                                    programTypeData.push({
                                              'ProgramTypeId': data[i].id,
                                              'ProgramType': data[i].programTypeName,
                                            });
                                }
                                 this.setState({programtypes: programTypeData})
                             })

        // getDataAsync(base_url + '/sources').then(data => { this.setState({communities: data})});
//        let paymentmodesdata =[{'PaymentModeId' : 1, 'PaymentMode': 'Inkind'},{'PaymentModeId' : 2, 'PaymentMode': 'Cash'},{'PaymentModeId' : 3, 'PaymentMode': 'Cheque'},{'PaymentModeId' : 4, 'PaymentMode': 'UPI'},{'PaymentModeId' : 5, 'PaymentMode': 'Online'}]
//        this.setState({paymentmodes: paymentmodesdata})
        getDataAsync(base_url + '/paymentMode')
                .then(data => {
                    let paymentModeData = []
                    for(let i = 0; i < data.length; i++){
                        paymentModeData.push({
                                  'PaymentModeId': data[i].sponsorshipTypeID,
                                  'PaymentMode': data[i].sponsorshipType,
                                });
                    }
                     this.setState({paymentmodes: paymentModeData})
                 })

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
        console.log("Mounting Data")
        let orgId = getOrgId();
        this.setState({orgid: orgId});
        console.log(this.state.orgid)
        this.addDonorConstants();
        this.fetchItemsData();
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

    _submitAddDonorForm(values) {
        console.log("Props", this.props.navigation.state.params.donorDetails)
        console.log("submitdonor called");
        const city_value = this.state.orgLevel===5 ? [this.state.rainbowHome["rhCode"]] : this.state.selectedCities
        const home_value = this.state.orgLevel===5 ? [this.state.rainbowHome["rhNo"]] : this.state.selectedHomes
        let request_body = JSON.stringify({
            "City": city_value,
            "Home": home_value,
            "DonationDate": values.DonationDate,
            "ProgramType": values.ProgramType,
            "PaymentMode": values.PaymentMode,
            "Amount": values.Amount,
            "Quantity": values.Quantity
        });
        console.log(request_body);
        console.log(this.state.selectedCities, this.state.selectedHomes)
        this.setState({contributionPage1: request_body})
    }

    

    render() {
        const { selectedCities, selectedHomes } = this.state;
        return (
            <View style = {globalStyles.container}>
                
                <Formik
                initialValues = {
                    {
                        City : this.state.City,
                        Home : this.state.Home,
                        DonationDate: this.state.donationdate,
                        ProgramType: '',
                        PaymentMode: '',
                        Amount: '',
                        Quantity: ''
                    }
                }
                validationSchema = {IndividualContributionSchema1}
                onSubmit = {async (values, actions) => {
                    // this.setState({showLoader: true,loaderIndex:10});
                    this.setState({submitButtonDisabled: true});
                    let result = this._submitAddDonorForm(values);
                    let alertMessage = this.state.submitAlertMessage;
                    console.log(result);
                    this.setState({submitButtonDisabled: false});
                    this.props.navigation.navigate('IndividualContribution2', {donorDetails: this.props.navigation.state.params.donorDetails, contributionPage1: this.state.contributionPage1});
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
                                
                                <Text style = {globalStyles.label}>Contribution Towards</Text>

                                {/* City */}
                                <Text style = {globalStyles.label}>City<Text style={{color:"red"}}>*</Text> :</Text>
                                { this.state.orgLevel ===5 ?
                                    <TextInput
                                    style = {globalStyles.inputText}
                                    value={this.state.City}
                                    editable={false}
                                    selectTextOnFocus={false}
                                    onChangeText = {props.handleChange('City')}
                                    />                                
                                    :
                                    <MultiSelect
                                          hideTags
                                          items={this.state.cities}
                                          uniqueKey="stateNetworkNo"
                                          ref={(component) => { this.multiSelect = component }}
                                          onSelectedItemsChange={this.onSelectedCitiesChange}
                                          selectedItems={selectedCities}
                                          selectText="Pick Items"
                                          searchInputPlaceholderText="Search City"
                                        //   onChangeInput={ (text)=> console.log(text)}
                                        //   tagRemoveIconColor="#CCC"
                                        //   tagBorderColor="#CCC"
                                        //   tagTextColor="#CCC"
                                        //   selectedItemTextColor="#CCC"
                                        //   selectedItemIconColor="#CCC"
                                        //   itemTextColor="#000"
                                          displayKey="stateNetworkName" 
                                        //   searchInputStyle={{ color: '#CCC' }}
                                        //   submitButtonColor="#CCC"
                                          submitButtonText="Select"
                                    />
                                    }
                                <Text style = {globalStyles.errormsg}>{props.touched.City && props.errors.City}</Text>
                                {/* Home */}
                                <Text style = {globalStyles.label}>Home<Text style={{color:"red"}}>*</Text> :</Text>
                                { this.state.orgLevel ===5 ?
                                    <TextInput
                                    style = {globalStyles.inputText}
                                    value={this.state.Home}
                                    editable={false}  
                                    selectTextOnFocus={false}
                                    onChangeText = {props.handleChange('Home')}
                                    />                                
                                    :
                                 this.state.homesVisible ? <MultiSelect
                                          hideTags
                                          items={this.state.homes}
                                          uniqueKey="rhNo"
                                          ref={(component) => { this.multiSelect = component }}
                                          onSelectedItemsChange={this.onSelectedHomesChange}
                                          selectedItems={selectedHomes}
                                          selectText="Pick Items"
                                          searchInputPlaceholderText="Search Home"
                                        //   onChangeInput={ (text)=> console.log(text)}
                                        //   tagRemoveIconColor="#CCC"
                                        //   tagBorderColor="#CCC"
                                        //   tagTextColor="#CCC"
                                        //   selectedItemTextColor="#CCC"
                                        //   selectedItemIconColor="#CCC"
                                        //   itemTextColor="#000"
                                          displayKey="rhName"
                                        //   searchInputStyle={{ color: '#CCC' }}
                                        //   submitButtonColor="#CCC"
                                          submitButtonText="Select"
                                        /> : <Text style = {globalStyles.label}>Select City</Text>

                                }
                                <Text style = {globalStyles.errormsg}>{props.touched.ProgramType && props.errors.ProgramType}</Text>
                                                                
                                {/* Donation Date */}
                                <Text style = {globalStyles.label}>Donation Date<Text style={{color:"red"}}>*</Text> :</Text>
                                <View style={globalStyles.dobView}>
                                    <TextInput
                                        style = {globalStyles.inputText, globalStyles.dobValue}
                                        value = {this.state.donationdate}
                                        editable = {false}
                                        onValueChange = {props.handleChange('DonationDate')}
                                    />
                                    <TouchableHighlight onPress={this.showDatepickerDD}>
                                        <View>
                                            <Feather style={globalStyles.dobBtn}  name="calendar"/>
                                        </View>
                                    </TouchableHighlight>
                                    {/* <Button style= {globalStyles.dobBtn} onPress={this.showDatepicker} title="Select DOB" /> */}
                                    {this.state.showdd && 
                                        <DateTimePicker
                                            style={{width: 200}}
                                            mode="date" //The enum of date, datetime and time
                                            value={ new Date() }
                                            mode= { 'date' }
                                            onChange= {(e,date) => this._pickDd(e,date,props.handleChange('DonationDate'))} 
                                            maximumDate= { new Date() }
                                        />
                                    }
                                </View>
                                <Text style = {globalStyles.errormsg}>{props.touched.DonationDate && props.errors.DonationDate}</Text>

                                {/* Program Type */}
                                <Text style = {globalStyles.label}>Program Type<Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.ProgramType}
                                    onValueChange = {value => {
                                        props.setFieldValue('ProgramType', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Program Type' color='grey' value = ''/>
                                    { 
                                        this.state.programtypes.map((item) => {
                                            return <Picker.Item key = {item.ProgramTypeId} label = {item.ProgramType} value = {item.ProgramTypeId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.ProgramType && props.errors.ProgramType}</Text>
                                
                                
                                
                                {/* PaymentMode */}
                                <Text style = {globalStyles.label}>Payment Mode <Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.PaymentMode}
                                    onValueChange = {value => {
                                        props.setFieldValue('PaymentMode', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='PaymentMode' color='grey' value = ''/>
                                    {
                                        this.state.paymentmodes.map((item) => {
                                            return <Picker.Item key = {item.PaymentModeId} label = {item.PaymentMode} value = {item.PaymentModeId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.PaymentMode && props.errors.PaymentMode}</Text>
                                

                                {/* Amount/Worth of Inkind */}
                                <Text style = {globalStyles.label}>Amount/Worth of In-kind <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('Amount')}
                                    value = {props.values.Amount}
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.Amount && props.errors.Amount}</Text>
                                
                                {/* Quantity/Days */}
                                <Text style = {globalStyles.label}>Quantity/Days <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('Quantity')}
                                    value = {props.values.Quantity}
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.Quantity && props.errors.Quantity}</Text>
                                 

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
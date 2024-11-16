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

const LeadDonorFormSchema3 = yup.object({
    WillingToSupport : yup.string(),
    fromDate: yup.string().required(),
    Amount: yup.string().required(),
});


export default class LeadDonor3 extends React.Component{
    constructor(props) {
        super(props);
    }

    state = {
        loaderIndex: 0,
        showLoader: false,
        isProposalSubmitted : 0,
        showFromdd: false,
        showTodd: false,
        fromDate: '',
        toDate:'',
        showFromdd: false,
        isVisible: false,
        sucessDisplay: false,
        errorDisplay: false,
        pageOne: true,
        currentPage: 1,
        submitButtonDisabled: false,
        leadDonationDetails: "",
        willingtosupports : [],
        selectedSupport : [],
        leadNo: '',
        orgid : 0
    };



    onSelectedSupportChange = selectedSupport => {
        this.setState({ selectedSupport : selectedSupport });
      };


    async addLeadConstants(){
        getDataAsync(base_url + '/willing-to-support-category')
        .then(data => {
            let willingToSupportData = []
            for(let i = 0; i < data.length; i++){
                willingToSupportData.push({
                          'supportId': data[i].willingToSupportId,
                          'supportType': data[i].categoryName,
                        });
            }
             this.setState({willingtosupports: willingToSupportData})
         })
    }

    _changeIsProposalSubmitted= (value, handleChange) => {
        this.setState({isProposalSubmitted: value==='true'});
        handleChange(value);
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
        console.log(this.state.orgid)
        this.addLeadConstants();
    }

    _pickFromDd = (event,date,handleChange) => {
        if(event["type"] == "dismissed") {

        }
        else {
            let a = moment(date).format('YYYY-MM-DD');
            this.setState({fromDate:a, showFromdd: false});
            handleChange(a);
        }
    }

    _pickToDd = (event,date,handleChange) => {
        if(event["type"] == "dismissed") {

        }
        else {
            let a = moment(date).format('YYYY-MM-DD');
            this.setState({toDate:a, showTodd: false});
            handleChange(a);
        }
    }

    resetdatesandradio() {
        this.setState({specialdaydate:''});
    }

    showFromDatepickerDD = () => {
        this.setState({showFromdd: true});
    };

    showToDatepickerDD = () => {
        this.setState({showTodd: true});
    };

    async _submitAddLeadForm(values) {
        console.log("Props", this.props.navigation.state.params.orgDetails, this.props.navigation.state.params.pocDetails)
        const orgDetails = JSON.parse(this.props.navigation.state.params.orgDetails)
        const pocDetails = JSON.parse(this.props.navigation.state.params.pocDetails)
        
        console.log("submitlead called");
        let request_body = JSON.stringify({
            "organisationName": orgDetails.OrganisationName,
            "leadOrganisationTypeId": orgDetails.OrganisationType,
            "organisationRegion": orgDetails.OrganisationRegion,
            "address": orgDetails.OrganisationAddress,
            "orgContactNumber": orgDetails.PhoneNumber,
            "organisationLogoName": orgDetails.CompanyLogo,
            "pointOfContactName": pocDetails.POCName,
            "genderId": pocDetails.Gender,
            "designation": pocDetails.Designation,
            "email": pocDetails.Email,
            "pocContactNumber": pocDetails.PhoneNumber,
            "expectedAmount": values.Amount,
            "followUp": true,
            "leadBroughtBy": getUserName(),
            "proposalSubmitted": values.IsProposalSubmitted,
            "utilizationFrom": values.fromDate,
            "utilizationTo": values.toDate,
            "willingToSupport": this.state.selectedSupport.join(", ")
          });
        console.log(request_body);
        this.setState({leadDonationDetails: request_body})

        const response = await fetch(base_url+"/create-lead", {
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
            this.setState({leadNo: responseJson.leadNo})
            this._uploadImage(responseJson)
            console.log("Lead Created with LeadNo:", this.state.leadNo)
        }
        else {
            console.log("failed")
            return 'failed'
        }
        return response;
    }

    buildLeadImageName(leadNo, organisationName){
        let date_string = moment(new Date()).format('DDMMYYYYHHmmss')
        return `/Images/${leadNo}_${organisationName}_${date_string}.png`
    }
    _uploadImage(responseJson){
        const imageUri = responseJson.organisationLogoName
        console.log(imageUri);
        console.log("Image URI");
        let imageName = this.buildLeadImageName(responseJson.leadNo, responseJson.organisationName);
        let photoUrl = base_url+"/upload-image/"+responseJson.leadNo + imageName;
        console.log(photoUrl);
        var formdata = new FormData();
        formdata.append('file', { uri: imageUri, name: `${imageName.split('/')[2]}.jpg`, type: 'image/jpg' });
        fetch(photoUrl, {
            method: 'PUT',
            headers: {
                'content-type': 'multipart/form-data;boundary=----WebKitFormBoundaryyEmKNDsBKjB7QEqu',
                'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
            },
            body: formdata,
        })
        .then((response) => {
            console.log("*****");
            console.log(response.status);
            console.log("******");
            if(response.status == 200) {
                        this.state.photoUploadMessage = ". Succesfully uploaded image";
                        imageupload = true;
            }
        })
    }

    _failureAlertUser() {
        console.log("Alert")
        Alert.alert("Failure", "Failed to create the lead", [{ text: "OK" , onPress: () => this.props.navigation.navigate('LeadDonor1')}],
        {cancelable: false},);
    }

    render() {
        const { selectedSupport } = this.state;
        const radio_props = [
                            { label: 'Yes', value: "true" },
                            { label: 'No', value: "false" },
                        ];
        return (
            <View style = {globalStyles.container}>
                
                <Formik
                initialValues = {
                    {
                        fromDate: this.state.fromDate,
                        toDate: this.state.toDate,
                        WillingToSupport: '',
                        Amount: '',
                        IsProposalSubmitted: "true"
                    }
                }
                validationSchema = {LeadDonorFormSchema3}
                onSubmit = {async (values, actions) => {
                    // this.setState({showLoader: true,loaderIndex:10});
                    // this.setState({submitButtonDisabled: true});
                    let result = await this._submitAddLeadForm(values);
                    let alertMessage = this.state.submitAlertMessage;
                    if(result==='failed'){
                        await this._failureAlertUser()
                    }
                    else {
                        this.props.navigation.navigate('LeadDonor4', {donorDetails: this.props.navigation.state.params.donorDetails, leadDonationDetails: this.state.leadDonationDetails, leadNo: this.state.leadNo});
                    }
                    this.setState({submitButtonDisabled: false});
                    // this.props.navigation.navigate('LeadDonor4', {donorDetails: this.props.navigation.state.params.donorDetails, leadDonationDetails: this.state.leadDonationDetails, leadNo: this.state.leadNo});

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
                                
                                <Text style={globalStyles.headerText}>Donation Details</Text>



                                {/* Willing to Support */}
                                <Text style = {globalStyles.label}>Willing to Support<Text style={{color:"red"}}>*</Text> :</Text>
                                <MultiSelect
                                        hideTags
                                        items={this.state.willingtosupports}
                                        uniqueKey="supportId"
                                        ref={(component) => { this.multiSelect = component }}
                                        onSelectedItemsChange={this.onSelectedSupportChange}
                                        selectedItems={selectedSupport}
                                        selectText="Pick Items"
                                    //   onChangeInput={ (text)=> console.log(text)}
                                    //   tagRemoveIconColor="#CCC"
                                    //   tagBorderColor="#CCC"
                                    //   tagTextColor="#CCC"
                                    //   selectedItemTextColor="#CCC"
                                    //   selectedItemIconColor="#CCC"
                                    //   itemTextColor="#000"
                                        displayKey="supportType" 
                                    //   searchInputStyle={{ color: '#CCC' }}
                                    //   submitButtonColor="#CCC"
                                        submitButtonText="Select"
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.WillingToSupport && props.errors.WillingToSupport}</Text>

                                {/* Expected Amount */}
                                <Text style={globalStyles.label}>Expected Amount<Text style={{ color: "red" }}></Text></Text>

                                 <TextInput
                                 keyboardType="numeric"
                                 style = {globalStyles.inputText}
                                 onChangeText = {props.handleChange('Amount')}
                                 value = {props.values.Amount}
                                 placeholder="Expected Amount"
                                 // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                                                 />
                                 <Text style = {globalStyles.errormsg}>{props.touched.Amount && props.errors.Amount}</Text>



                                {/* Utilisation Duration */}
                                <Text style = {globalStyles.label}>Utilisation Duration<Text style={{color:"red"}}></Text> :</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {/* First Date Field */}
                                    <View style={[globalStyles.dobView, { flex: 1, marginRight: 5 }]}>
                                    <TextInput
                                        style = {{...globalStyles.inputText, ...globalStyles.dobValue}}
                                        value = {this.state.fromDate}
                                        editable = {false}
                                        onValueChange = {props.handleChange('fromDate')}
                                    />
                                    <TouchableHighlight onPress={this.showFromDatepickerDD}>
                                        <View>
                                            <Feather style={globalStyles.dobBtn}  name="calendar"/>
                                        </View>
                                    </TouchableHighlight>
                                    {/* <Button style= {globalStyles.dobBtn} onPress={this.showDatepicker} title="Select DOB" /> */}
                                    {this.state.showFromdd && 
                                        <DateTimePicker
                                            style={{width: 200}}
                                            mode="date" //The enum of date, datetime and time
                                            value={ new Date() }
                                            onChange= {(e,date) => this._pickFromDd(e,date,props.handleChange('fromDate'))}
                                        />
                                    }
                                    </View>

                                    {/* Second Date Field */}
                                    <View style={[globalStyles.dobView, { flex: 1, marginLeft: 5 }]}>
                                        <TextInput
                                            style = {{...globalStyles.inputText, ...globalStyles.dobValue}}
                                            value = {this.state.toDate}
                                            editable = {false}
                                            onValueChange = {props.handleChange('toDate')}
                                        />
                                        <TouchableHighlight onPress={this.showToDatepickerDD}>
                                            <View>
                                                <Feather style={globalStyles.dobBtn}  name="calendar"/>
                                            </View>
                                        </TouchableHighlight>
                                        {/* <Button style= {globalStyles.dobBtn} onPress={this.showDatepicker} title="Select DOB" /> */}
                                        {this.state.showTodd && 
                                            <DateTimePicker
                                                style={{width: 200}}
                                                mode="date" //The enum of date, datetime and time
                                                value={ new Date() }
                                                onChange= {(e,date) => this._pickToDd(e,date,props.handleChange('toDate'))}
                                            />
                                        }
                                    </View>
                                </View>
                                <Text style = {globalStyles.errormsg}>{props.touched.fromDate && props.errors.fromDate}</Text>


                                {/* Proposal Submitted */}

                                <Text style={globalStyles.label}>Is proposal submitted? <Text style={{ color: "red" }}></Text></Text>

                                <RadioForm
                                    style={{ marginLeft: 10, marginTop: 10 }}
                                    radio_props={radio_props}
                                    buttonSize={10}
                                    formHorizontal={true}
                                    buttonOuterSize={20}
                                    buttonColor={'black'}
                                    buttonInnerColor={'black'}
                                    selectedButtonColor={'blue'}
                                    labelStyle={{ marginRight: 20 }}
                                    onPress={value => this._changeIsProposalSubmitted(value, props.handleChange('IsProposalSubmitted'))}
                                            />
                                <Text style = {globalStyles.errormsg}>{props.touched.IsProposalSubmitted && props.errors.IsProposalSubmitted}</Text>

                                 

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
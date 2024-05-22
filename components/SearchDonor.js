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

const AddChildSchema = yup.object({
    ChildPhoto: yup.string().required(),
    ChildID: yup.string(),
    FirstName: yup.string().required(),
    LastName: yup.string().required(),
    Gender: yup.string().required(),
    DOB: yup.string().required(),
    Religion: yup.string().required(),
    Community: yup.string().required(),
    MotherTongue: yup.string().required(),
    ParentalStatus: yup.string().required(),
    ReasonForAdmission: yup.string().required(),
    PreviousEducationStatus: yup.string().required(),
    AdmittedBy: yup.string().required(),
    DOA: yup.string().required(),
    ReferredSource: yup.string().required(),
    ReferredBy: yup.string().required(),
});

let imagePath = null;

const defaultImg = require('../assets/person.png');

export default class SearchDonor extends React.Component{

    
    state = {
        image : null,
        showdob: false,
        showdoa: false,
        showLoader: false,
        loaderIndex: 0,
        gender: 2,
        dob: '',
        age: '',
        doa: '',
        religions: [],
        communities: [],
        motherTongues: [],
        parentalStatusList: [],
        admissionReasons: [],
        educationStatusList: [],
        homeStaffList: [],
        referralSourcesList: [],
        childStatusList: [],
        childStatusId: '',
        submitAlertMessage: '',
        photoUploadMessage: '',
        orgid: '',
        homecode: '',
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
        this.addChildConstants();
        let orgId = getOrgId();
        this.setState({orgid: orgId});
        let homeCode = getHomeCode();
        this.setState({homecode: homeCode});
        console.log(this.state.homeCode);
    }


    async _pickImage (handleChange) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if(status == 'granted'){
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            });
            if (!result.cancelled) {
                console.log("image uri")
                console.log(result.uri);
                this.setState({ image: result.uri });
                imagePath = result.uri;
                console.log(this.state.image);
                console.log(typeof(result.uri))
                handleChange(result.uri)
            }
        }
    }

    async addChildConstants(){
        getDataAsync(base_url + '/religions').then(data => { this.setState({religions: data})});
    
        getDataAsync(base_url + '/communities').then(data => { this.setState({communities: data})});
    
        getDataAsync(base_url + '/mother-tongues').then(data => { this.setState({motherTongues: data})});
    
        getDataAsync(base_url + '/parental-statuses').then(data => { this.setState({parentalStatusList: data})});
    
        getDataAsync(base_url + '/admission-reasons').then(data => { this.setState({admissionReasons: data})});
    
        getDataAsync(base_url + '/education-statuses').then(data => { this.setState({educationStatusList: data})});

        getDataAsync(base_url + '/home-staff-list/'+getOrgId()).then(data => {this.setState({homeStaffList: data})});
        
        getDataAsync(base_url + '/referral-sources').then(data => {this.setState({referralSourcesList: data})});
    
        getDataAsync(base_url + '/child-statuses').then(data => {
            this.setState({childStatusList: data});
            this.state.childStatusList.map((item) => {
                if(item.childStatus == "Observation") this.setState({childStatusId:item.childStatusId}); 
            });
        });
    }

    _pickDob = (event,date,handleChange) => {
        console.log(event);
        if(event["type"] == "dismissed") {

        }
        else {
            let a = moment(date).format('YYYY-MM-DD');
            this.setState({dob:a, showdob: false});
            let today = new Date();
            let b = moment(today);
            var age = moment.duration(b.diff(a));
            var years = age.years();
            var months = age.months();
            var days = age.days();
            var ageResult = years+" years "+months+" months "+days+" days";
            this.setState({age:ageResult});
            handleChange(a);
        }
    }

    _pickDoa = (event,date,handleChange) => {
        if(event["type"] == "dismissed") {

        }
        else {
            let a = moment(date).format('YYYY-MM-DD');
            this.setState({doa:a, showdoa: false});
            handleChange(a);
        }
    }

    _changeGender = (value, handleChange) => {
        this.setState({gender: value});
        console.log(value);
        handleChange(value);
    }

    showDatepickerDOB = () => {
        this.setState({showdob: true});
    };

    showDatepickerDOA = () => {
        this.setState({showdoa: true});
    };

    handleDobChange = () => {
        console.log("change called");
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
        this.addChildConstants();
    }

    resetdatesandradio() {
        this.setState({dob:'',doa:''});
        this.setState({image : null});
        this.setState({gender: 2});
        this.setState({age:''});
    }

    _submitAddChildForm(values) {
        console.log("submitchild called");
        let request_body = JSON.stringify({
            "firstName": values.FirstName,
            "lastName": values.LastName,
            "gender": values.Gender,
            "dateOfBirth": values.DOB,
            "religion": values.Religion,
            "community": values.Community,
            "motherTongue": values.MotherTongue,
            "parentalStatus": values.ParentalStatus,
            "reasonForAdmission": values.ReasonForAdmission,
            "educationStatus": values.PreviousEducationStatus,
            "admissionDate":values.DOA,
            "admittedBy": values.AdmittedBy,
            "referredBy": values.ReferredBy,
            "referredSource": values.ReferredSource,
            "childStatus": this.state.childStatusId,
            "rainbowHomeNumber": this.state.orgid
        });
        var imageupload = false;
        fetch(base_url+"/child", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
            },
            body: request_body,
        })
        .then((response) =>{
            if(response.ok) {
                console.log("printing status");
                console.log(response.status);
                console.log("printing status");
                response.json().then((responseJson) => {
                    let childId = responseJson.childNo;
                    let childName = responseJson.firstName;
                    this.loadStats();
                    let imageUri = '';
                    if(imagePath === null) {
                        imageUri= ''
                    }
                    else {
                        imageUri = imagePath;
                    }
                    console.log("Image URI");
                    console.log(imageUri);
                    console.log("Image URI");
                    let imageName = buildTestImageName(responseJson.childNo, responseJson.firstName);
                    let photoUrl = base_url+"/upload-image/"+responseJson.childNo + imageName;
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
                        else {
                                    this.state.photoUploadMessage = ". Error uploading image";
                        }
                        this.setState({submitAlertMessage: 'Successfully added Child '+childName+' in '+getHomeCode()+ this.state.photoUploadMessage});
                        Alert.alert(
                                    'Added Child',
                                    this.state.submitAlertMessage,
                                    [
                                        { text: 'OK', onPress: () => this.props.navigation.goBack() },
                                    ],
                                    { cancelable: false },
                        ); 
                        this.setState({isVisible: true, errorDisplay: true});
                        this.setState({showLoader: false,loaderIndex:0});
                    })
                    .catch((error)=> {
                        this.state.photoUploadMessage = ".Error uploading image";
                        this.setState({submitAlertMessage: 'Successfully added Child '+childName+' in '+getHomeCode()+ this.state.photoUploadMessage});
                        Alert.alert(
                            'Added Child',
                            this.state.submitAlertMessage,
                            [
                                { text: 'OK', onPress: () => this.props.navigation.goBack() },
                            ],
                            { cancelable: false },
                        );
                        this.setState({isVisible: true, errorDisplay: true});
                        this.setState({showLoader: false,loaderIndex:0});
                    })
                })
            }
            else {
                if(response.status == 500) {
                    response.json().then((responseJson) => {
                        console.log(responseJson)
                        if(responseJson.message == "Duplicate profile") {
                            this.setState({submitAlertMessage: 'Unable to add child. Plesae contact the Admin.'});
                            Alert.alert(
                                'Failed To Add Child',
                                responseJson.message+". Child already present.",
                                [
                                    { text: 'OK', onPress: () => console.log("Failed to add child") },
                                ],
                                { cancelable: false },
                            );
                            this.setState({isVisible: true, errorDisplay: true});
                            this.setState({showLoader: false,loaderIndex:0});
                        }
                    })
                }
                else {
                    throw Error(response.status);
                }
            }
        })
        .catch((error) => {
            this.setState({submitAlertMessage: 'Unable to add child. Plesae contact the Admin.'});
            Alert.alert(
                'Failed To Add Child',
                this.state.submitAlertMessage,
                [
                    { text: 'OK', onPress: () => console.log("Failed to add child") },
                ],
                { cancelable: false },
            );
            this.setState({isVisible: true, errorDisplay: true});
            this.setState({showLoader: false,loaderIndex:0});
        });
    }

    render() {

        const radio_props = [
            {
                label: 'Male',
                value: '1',
            },
            {
                label: 'Female',
                value: '2',
            }
        ];
        
        return (
            <View style = {globalStyles.container}>
                

                <Formik
                initialValues = {
                    {
                        ChildPhoto: '',
                        ChildID: '',
                        FirstName: '',
                        LastName: '',
                        Gender: 1,
                        DOB: this.state.dob,
                        DOA: this.state.doa,
                        Religion: '',
                        Community: '',
                        MotherTongue: '',
                        ParentalStatus: '',
                        ReasonForAdmission:'',
                        PreviousEducationStatus: '',
                        AdmittedBy: '',
                        ReferredSource: '',
                        ReferredBy: '',
                    }
                }
                validationSchema = {AddChildSchema}
                onSubmit = {async (values, actions) => {
                    console.log("Submit method called here ");
                    let dob = moment(values.DOB);
                    console.log(values.DOB);
                    console.log(values.DOA);
                    let doa = moment(values.DOA);
                    let diff = doa.diff(dob,'years',true);
                    console.log(doa.isBefore(values.DOB));
                    if(doa.isBefore(values.DOB)) {
                        Alert.alert(
                            'To Add Child',
                            'Date of Admission cannt be before Date of Birth',
                            [
                                { text: 'OK', onPress: () => {} },
                            ],
                            { cancelable: false },
                        ); 
                    }
                    else if(diff < 2) {
                        Alert.alert(
                            'To Add Child',
                            'Child age should be atleast 2 years',
                            [
                                { text: 'OK', onPress: () => {} },
                            ],
                            { cancelable: false },
                        ); 
                    }
                    else {
                        this.setState({showLoader: true,loaderIndex:10});
                        this.setState({submitButtonDisabled: true});
                        let result = this._submitAddChildForm(values);
                        let alertMessage = this.state.submitAlertMessage;
                        console.log(result);
                        this.resetdatesandradio();
                        this.setState({submitButtonDisabled: false});
                        actions.resetForm();
                    }
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
                                    <Text style={globalStyles.PageHeader}>Search Donor</Text>
                                </View>
                                
                                {/* First Name */}
                                <Text style = {globalStyles.label}>First Name <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('FirstName')}
                                    value = {props.values.FirstName}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.FirstName && props.errors.FirstName}</Text>

                                {/* Last Name */}
                                <Text style = {globalStyles.label}>Last Name <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('LastName')}
                                    value = {props.values.LastName}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.LastName && props.errors.LastName}</Text>

                                {/* Gender */}
                                <Text style = {globalStyles.label}>Gender <Text style={{color:"red"}}>*</Text> :</Text>
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
                                        onPress={(value) => this._changeGender(value,props.handleChange('Gender'))}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.Gender && props.errors.Gender}</Text>

                                
                                </View>}
                                
                                {this.state.pageTwo && <View>
                                    <View style={globalStyles.backgroundlogoimageview}>
                                        <Image source = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
                                    </View>

                                {/* DOB */}
                                <Text style = {globalStyles.label}>Date Of Birth <Text style={{color:"red"}}>*</Text> :</Text>
                                <View style={globalStyles.dobView}>
                                    <TextInput
                                        style = {globalStyles.inputText, globalStyles.dobValue}
                                        value = {this.state.dob}
                                        editable = {false}
                                        onValueChange = {props.handleChange('DOB')}
                                    />
                                    <TouchableHighlight onPress={this.showDatepickerDOB}>
                                        <View>
                                            <Feather style={globalStyles.dobBtn}  name="calendar"/>
                                        </View>
                                    </TouchableHighlight>
                                    {/* <Button style= {globalStyles.dobBtn} onPress={this.showDatepicker} title="Select DOB" /> */}
                                    {this.state.showdob && 
                                        <DateTimePicker
                                            style={{width: 200}}
                                            mode="date" //The enum of date, datetime and time
                                            value={ new Date() }
                                            mode= { 'date' }
                                            onChange= {(e,date) => this._pickDob(e,date,props.handleChange('DOB'))} 
                                            maximumDate= { new Date((new Date()).setDate((new Date()).getDate() - 1)) }
                                        />
                                    }
                                </View>
                                <Text style = {globalStyles.errormsg}>{props.touched.DOB && props.errors.DOB}</Text>

                                {/* Age */}
                                <Text style = {globalStyles.label}>Age <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    value = {this.state.age}
                                    editable= {false}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.ChildStatus && props.errors.ChildStatus}</Text>
                                
                                {/* Religion */}
                                <Text style = {globalStyles.label}>Religion <Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.Religion}
                                    onValueChange = {value => {
                                        props.setFieldValue('Religion', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Religion' color='grey' value = ''/>
                                    { 
                                        this.state.religions.map((item) => {
                                            return <Picker.Item key = {item.religionId} label = {item.religion} value = {item.religionId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.Religion && props.errors.Religion}</Text>
                                
                                
                                
                                {/* Community */}
                                <Text style = {globalStyles.label}>Community <Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.Community}
                                    onValueChange = {value => {
                                        props.setFieldValue('Community', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Community' color='grey' value = ''/>
                                    {
                                        this.state.communities.map((item) => {
                                            return <Picker.Item key = {item.communityId} label = {item.community} value = {item.communityId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.Community && props.errors.Community}</Text>
                                

                                {/* Mother Tongue */}
                                <Text style = {globalStyles.label}>Mother Tongue <Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.MotherTongue}
                                    onValueChange = {value => {
                                        props.setFieldValue('MotherTongue', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Mother Tongue' color='grey' value = ''/>
                                    {
                                        this.state.motherTongues.map((item) => {
                                            return <Picker.Item key = {item.motherTongueId} label = {item.motherTongue} value = {item.motherTongueId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.MotherTongue && props.errors.MotherTongue}</Text>
                                

                                {/* Parental Status */}
                                <Text style = {globalStyles.label}>Parental Status <Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.ParentalStatus}
                                    onValueChange = {value => {
                                        props.setFieldValue('ParentalStatus', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Parental Status' color='grey' value = ''/>
                                    {
                                        this.state.parentalStatusList.map((item) => {
                                            return <Picker.Item key = {item.parentalStatusId} label = {item.parentalStatus} value = {item.parentalStatusId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.ParentalStatus && props.errors.ParentalStatus}</Text>
                                

                                {/* Reason For Admission */}
                                <Text style = {globalStyles.label}>Reason For Admission <Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.ReasonForAdmission}
                                    onValueChange = {value => {
                                        props.setFieldValue('ReasonForAdmission', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Reason For Admission' color='grey' value = ''/>
                                    {
                                        this.state.admissionReasons.map((item) => {
                                            return <Picker.Item key = {item.reasonForAdmissionId} label = {item.reasonForAdmission} value = {item.reasonForAdmissionId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.ReasonForAdmission && props.errors.ReasonForAdmission}</Text>
                                
                                {/* Previous Education Status */}
                                <Text style = {globalStyles.label}>Previous Education Status <Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.PreviousEducationStatus}
                                    onValueChange = {value => {
                                        props.setFieldValue('PreviousEducationStatus', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Previous Education Status' color='grey' value = ''/>
                                    {
                                        this.state.educationStatusList.map((item) => {
                                            return <Picker.Item key = {item.educationStatusId} label = {item.educationStatus} value = {item.educationStatusId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.PreviousEducationStatus && props.errors.PreviousEducationStatus}</Text>
                                

                                </View>}


                                {this.state.pageThree && <View>
                                    <View style={globalStyles.backgroundlogoimageview}>
                                        <Image source = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
                                    </View>

                                {/* Admitted By */}
                                <Text style = {globalStyles.label}>Admitted By <Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.AdmittedBy}
                                    onValueChange = {value => {
                                        props.setFieldValue('AdmittedBy', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Admitted By' color='grey' value = ''/>
                                    {
                                        this.state.homeStaffList.map((item) => {
                                            return <Picker.Item key = {item.staffNo} label = {item.firstName + ' ' + item.lastName} value = {item.staffNo}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.AdmittedBy && props.errors.AdmittedBy}</Text>
                                

                                {/* DOA */}
                                <Text style = {globalStyles.label}>Date Of Admission <Text style={{color:"red"}}>*</Text> :</Text>
                                <View style={globalStyles.dobView}>
                                    <TextInput
                                        style = {globalStyles.inputText, globalStyles.dobValue}
                                        value = {this.state.doa}
                                        editable = {false}
                                        onValueChange = {props.handleChange('DOA')}
                                    />
                                    <TouchableHighlight onPress={this.showDatepickerDOA}>
                                        <View>
                                            <Feather style={globalStyles.dobBtn}  name="calendar"/>
                                        </View>
                                    </TouchableHighlight>
                                    {/* <Button style= {globalStyles.dobBtn} onPress={this.showDatepicker} title="Select DOB" /> */}
                                    {this.state.showdoa && 
                                        <DateTimePicker
                                            style={{width: 200}}
                                            mode="date" //The enum of date, datetime and time
                                            value={ new Date() }
                                            mode= { 'date' }
                                            onChange= {(e,date) => this._pickDoa(e,date,props.handleChange('DOA'))} 
                                            maximumDate= { new Date() }
                                            minimumDate= { new Date((new Date()).setDate((new Date()).getDate() - 3)) }
                                        />
                                    }
                                </View>
                                <Text style = {globalStyles.errormsg}>{props.touched.DOA && props.errors.DOA}</Text>

                                {/* Referred Source */}
                                <Text style = {globalStyles.label}>Referred Source <Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.ReferredSource}
                                    onValueChange = {value => {
                                        props.setFieldValue('ReferredSource', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Select Referred Source' color='grey' value = ''/>
                                    {
                                        this.state.referralSourcesList.map((item) => {
                                            return <Picker.Item key = {item.referralSourceId} label = {item.referralSource} value = {item.referralSourceId}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.ReferredSource && props.errors.ReferredSource}</Text>
                                

                                {/* Referred By */}
                                <Text style = {globalStyles.label}>Referred By <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('ReferredBy')}
                                    value = {props.values.ReferredBy}
                                    // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.ReferredBy && props.errors.ReferredBy}</Text>
                                

                                {/* Child Status */}
                                <Text style = {globalStyles.label}>Child Status <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    value = {"Observation"}
                                    editable= {false}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.ChildStatus && props.errors.ChildStatus}</Text>
                                

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
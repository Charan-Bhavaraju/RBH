import React, { Component } from 'react';
import RadioForm from 'react-native-simple-radio-button';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView , Image, StyleSheet, Alert, TouchableOpacity,Switch} from 'react-native';
import {Formik} from 'formik';
import {globalStyles} from '../styles/global';
import * as yup from 'yup';
import {base_url,getDataAsync} from '../constants/Base';
import { ActivityIndicator } from 'react-native';
import {getPassword, getUserName} from '../constants/LoginConstant';
import { getSelectedDonor, setSelectedDonor } from '../constants/DonorConstants';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

let imagePath = null;

const AddDonorSchema = yup.object({
    OrganisationName: yup.string().required(),
    OrganisationType: yup.string().required(),
    OrganisationRegion: yup.string().required(),
    OrganisationAddress: yup.string().required(),
    PhoneNumber:  yup.string().matches(/^[0-9]{10}$/, 'Enter 10 digit Phone number'),
});

export default class LeadDonor1 extends React.Component{
    constructor(props){
        super(props)
    this.state ={
        image : null,
        loaderIndex: 0,
        showLoader: false,
        organisationtypes: [],
        organisationRegion : 0,
        pageOne: true,
        submitButtonDisabled: false,
        orgDetails: "",
        openSourceDropDown: false,
        selectedDonorDetails: getSelectedDonor(),
        isLogoAllowed : false
    };
    }

    async addLeadConstants(){
        getDataAsync(base_url + '/lead-organisation-type')
                    .then(data => {
                        let orgTypesData = []
                        for(let i = 0; i < data.length; i++){
                            orgTypesData.push({
                                      'id': data[i].id,
                                      'organisationType': data[i].leadOrgTypeName,
                                    });
                        }
                         this.setState({organisationtypes: orgTypesData})
                     })

        // let orgtypedata =[{'id' : 1, 'organisationType': 'Company'},{'id' : 2, 'organisationType': 'Org/Trust'},{'id' : 3, 'organisationType': 'HNI'},{'id' : 4, 'organisationType': 'Family Foundation'},{'id' : 5, 'organisationType': 'Foundation'}]
        // this.setState({organisationtypes: orgtypedata})

        }

    _changeOrganisationRegion= (value, handleChange) => {
        this.setState({organisationRegion: value});
        console.log(value);
        handleChange(value);
    }

    componentDidMount() {
        console.log('mounting component');
        this.addLeadConstants();
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
                this.setState({ image: result.uri });
                imagePath = result.uri;
                console.log(this.state.image);
                handleChange(result.uri)
            }
        }
    }

    async _submitOrgDetailsForm(values) {
        console.log("Organisation Details Captured");
        let request_body = JSON.stringify({
            "OrganisationName": values.OrganisationName,
            "OrganisationType": values.OrganisationType,
            "OrganisationRegion": values.OrganisationRegion,
            "OrganisationAddress": values.OrganisationAddress,
            "PhoneNumber": values.PhoneNumber,
            "CompanyLogo": imagePath
        });
        this.setState({orgDetails: request_body})
        console.log(request_body)
    }

    toggleSwitch = () => {
        this.setState({ isLogoAllowed: !this.state.isLogoAllowed });
      };

    render() {
          const radio_props = [
                    { label: 'CSR', value: 'CSR' },
                    { label: 'FCRA', value: 'FCRA' },
                ];

        return (
            <View style = {globalStyles.container}>
                <Formik
                initialValues = {
                    {
                        OrganisationName: '',
                        OrganisationType: '',
                        OrganisationRegion: 'CSR',
                        OrganisationAddress: '',
                        PhoneNumber: '',
                    }
                }
                validationSchema = {AddDonorSchema}
                onSubmit = {async (values, actions) => {
                    this.setState({submitButtonDisabled: true});
                    this._submitOrgDetailsForm(values);
                    this.setState({submitButtonDisabled: false});
                    this.props.navigation.navigate('LeadDonor2', {orgDetails: this.state.orgDetails});
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
                                        <Image organisationType = {require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage}/>
                                    </View>
                                
                                <View style={globalStyles.PageHeaderView}>
                                    <Text style={globalStyles.PageHeader}></Text>
                                </View>

                                <Text style={globalStyles.headerText}>Organisation Details</Text>

                                {/* Organisation Name */}

                                <Text style = {globalStyles.label}>Organisation Name <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('OrganisationName')}
                                    value = {props.values.DonorName}
                                    placeholder="Organisation Name"
                                />       
                                <Text style = {globalStyles.errormsg}>{props.touched.OrganisationName && props.errors.OrganisationName}</Text>


                                {/* Organisation Type */}
                                <Text style = {globalStyles.label}>Organisation Type <Text style={{color:"red"}}>*</Text> :</Text>
                                <Picker
                                    selectedValue = {props.values.OrganisationType}
                                    onValueChange = {value => {
                                        props.setFieldValue('OrganisationType', value);
                                    }}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Organisation Type' color='grey' value = ''/>
                                    { 
                                        this.state.organisationtypes.map((item) => {
                                            return <Picker.Item key = {item.id} label = {item.organisationType} value = {item.id}/>
                                        })
                                    }
                                </Picker>
                                <Text style = {globalStyles.errormsg}>{props.touched.OrganisationType && props.errors.OrganisationType}</Text>
                                
                                {/* Organisation Region */}
                                <Text style = {globalStyles.label}>Organisation Region <Text style={{color:"red"}}>*</Text> :</Text>


                                <RadioForm

                                style={{ marginLeft: 10, marginTop: 10, marginBottom: 10 }}
                                radio_props={radio_props}
                                buttonSize={10}
                                formHorizontal={true}
                                buttonOuterSize={20}
                                buttonColor={'black'}
                                buttonInnerColor={'black'}
                                selectedButtonColor={'blue'}
                                labelStyle={{ marginRight: 20 }}
                                onPress={value => this._changeOrganisationRegion(value, props.handleChange('OrganisationRegion'))}
                                            />
                                <Text style = {globalStyles.errormsg}>{props.touched.OrganisationRegion && props.errors.OrganisationRegion}</Text>
                                

                                {/* Organisation Address */}
                                <Text style = {globalStyles.label}>Organisation Address <Text style={{color:"red"}}>*</Text> :</Text>
                                <TextInput
                                    style = {globalStyles.inputText}
                                    onChangeText = {props.handleChange('OrganisationAddress')}
                                    value = {props.values.OrganisationAddress}
                                    placeholder='Address'
                                    multiline={true}
                                    numberOfLines={2}
                                />
                                <Text style = {globalStyles.errormsg}>{props.touched.OrganisationAddress && props.errors.OrganisationAddress}</Text>

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

                                {/* Company Logo */}
                                {/* Toggle Switch */}
                                <View style={styles.switchContainer}>
                                <Text style={styles.label}>Can company logo be used</Text>
                                <Switch
                                    value={this.state.isLogoAllowed}
                                    onValueChange={this.toggleSwitch}
                                    thumbColor={this.state.isLogoAllowed ? '#fff' : '#f4f3f4'}
                                    trackColor={{ false: '#767577', true: '#007AFF' }} // Blue color for active switch
                                />    
                                </View>    

                                {/* Conditional Rendering for Logo Upload Section */}
                                {this.state.isLogoAllowed && (
                                <View>
                                <Image source={{ uri: this.state.image }} style={globalStyles.uploadImage}/>

                                <Button title="Upload Photo" onPress={() => this._pickImage(props.handleChange('CompanyPhoto'))} />
                                <Text style = {globalStyles.errormsg}>{props.touched.CompanyPhoto && props.errors.CompanyPhoto}</Text>
                                </View>    

                                )}


                                <Button style = {globalStyles.button} title= "Next" onPress={props.handleSubmit} disabled={this.state.submitButtonDisabled}/>
                                
                                
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
      padding: 20,
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
    uploadContainer: {
      alignItems: 'flex-start',
    },
    uploadBox: {
      width: 100,
      height: 100,
      borderWidth: 1,
      borderColor: '#007AFF',
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
    },
    plusSign: {
      fontSize: 30,
      color: '#007AFF',
    },
    uploadText: {
      fontSize: 14,
      color: '#007AFF',
    },
  });
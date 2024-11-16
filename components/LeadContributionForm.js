import React from 'react';
import {Button, Text, TextInput, View, Picker, ScrollView,
    KeyboardAvoidingView , Image, StyleSheet, Alert, TouchableOpacity} from 'react-native';
    import { CheckBox } from 'react-native-elements';
    import DateTimePicker from '@react-native-community/datetimepicker';
    import {Feather} from '@expo/vector-icons';
    import {Formik} from 'formik';
    import {globalStyles} from '../styles/global';
    import * as yup from 'yup';
    import moment from 'moment';
    import { TouchableHighlight } from 'react-native-gesture-handler';
    import {base_url,getDataAsync} from '../constants/Base';
    import { ActivityIndicator } from 'react-native';
    import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
    import {getPassword, getUserName} from '../constants/LoginConstant';
    
    import base64 from 'react-native-base64';
    import { setOrgId, getOrgId, setHomeCode, getHomeCode, setUserName, setPassword, setUserId, getUserId, setOrgLevelId, setRainbowHome, getRainbowHome } from '../constants/LoginConstant'
    
    
    const LeadContributionSchema = yup.object({
        DonationAmount: yup.number().required().min(0),
        DonationCycle: yup.string().required(),
        Remarks: yup.string().required(),
        // ReportType: yup.string().required(),
        // ReportingCycle: yup.string().required(),
    });
    
    let imagePath = null;
    
    const defaultImg = require('../assets/person.png');
    
    export default class LeadContribution extends React.Component{
    
        state = {
            loaderIndex: 0,
            showLoader: false,
            donationcycles: [],
            reporttypes: [],
            isVisible: false,
            sucessDisplay: false,
            errorDisplay: false,
            pageOne: true,
            submitButtonDisabled: false,
            isSharingChecked : false,
            isRenewalChecked : false
        };
        async addDonorConstants(){
            
            let donationcyclesdata =[{'DonationCycleId' : 1, 'DonationCycle': 'Quarterly'},{'DonationCycleId' : 2, 'DonationCycle': 'Half-Yearly'},{'DonationCycleId' : 3, 'DonationCycle': 'Yearly'}]
            this.setState({donationcycles: donationcyclesdata})
    
            getDataAsync(base_url + '/donation-report-type')
                            .then(data => {
                                let reporttypesdata = []
                                for(let i = 0; i < data.length; i++){
                                    reporttypesdata.push({
                                              'ReportTypeId': data[i].donationReportTypeId,
                                              'ReportType': data[i].donationReportTypeName,
                                            });
                                }
                                 this.setState({reporttypes: reporttypesdata})
                             })
    
            
            // let reporttypesdata =[{'ReportTypeId' : 1, 'ReportType': 'Child List'},{'ReportTypeId' : 2, 'ReportType': 'PPR'},{'ReportTypeId' : 3, 'ReportType': 'KPI'},{'ReportTypeId' : 4, 'ReportType': 'Annual Reports'}]
            // this.setState({reporttypes: reporttypesdata})
    
            // getDataAsync(base_url + '/donationCycle')
            //         .then(data => {
            //             let donationReasonData = []
            //             for(let i = 0; i < data.length; i++){
            //                 donationReasonData.push({
            //                           'DonationCycleId': data[i].donationCycleId,
            //                           'DonationCycle': data[i].donationReasonName,
            //                         });
            //             }
            //              this.setState({donationreasons: donationReasonData})
            //          })
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
    
    
        _alertUser() {
            let navigatepath = ''
            if(this.props.navigation.state.params.fromSearch){
                navigatepath = "SearchDonor"
            }else {
                navigatepath = "LeadDonor1"
            }
            Alert.alert("Success", "Donation Added Successfully", [{ text: "OK" , onPress: () => this.props.navigation.navigate(navigatepath)}],
            {cancelable: false},);
        }
    
        _failureAlertUser() {
            console.log("Alert")
            Alert.alert("Failure", "Failed to create the lead", [{ text: "OK" , onPress: () => this.props.navigation.navigate('LeadContributionForm')}],
            {cancelable: false},);
        }

        async _submitContributionForm(values){
            console.log("submitcontribution called");
            const isoTimestamp = new Date().toISOString();
            const sharingOfReports = true ? this.state.isSharingChecked == true : false
            const renewalOfDonor = true ? this.state.isRenewalChecked == true : false
    
            // add to contribution table
            let contribution_request_body = JSON.stringify({
                "leadNo": this.props.navigation.state.params.leadNo,
                "donationAmount": values.DonationAmount,
                "donationCycle": values.DonationCycle,
                "createdOn": isoTimestamp,
                "remarks": values.Remarks, 
                "quarterlyReportTypeId": values.QuarterlyReportType, 
                "halfYearlyReportTypeId": values.HalfYearlyReportType, 
                "yearlyReportTypeId": values.YearlyReportType, 
                "shareReport": sharingOfReports, 
                "renewDonor": renewalOfDonor
            });
            console.log(contribution_request_body)
    
    
            const response = await fetch(base_url+"/add-lead-donation", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
                },
                body: contribution_request_body,
            })
            if(response.ok) {
                const responseJson = await response.json()
                console.log("Lead Contribution Created")
                return response; 
            }
            else {
                console.log("failed")
                return 'failed'
            }
        }
    
        render() {
    
            return (
                <View style = {globalStyles.container}>
                    
                    <Formik
                    initialValues = {
                        {
                            DonationAmount: '',
                            DonationCycle: '',
                            Remarks: '',
                            QuarterlyReportType: '',
                            HalfYearlyReportType: '',
                            YearlyReportType: ''
                        }
                    }
                    validationSchema = {LeadContributionSchema}
                    onSubmit = {async (values, actions) => {
                        // this.setState({showLoader: true,loaderIndex:10});
                        this.setState({submitButtonDisabled: true});
                        // console.log(this.props.navigation.state.params.donorDetails)
                        let res = await this._submitContributionForm(values);
                        let alertMessage = this.state.submitAlertMessage;
                        if(res==='failed'){
                            await this._failureAlertUser()
                        }
                        else {
                            // this.setState({submitButtonDisabled: false});
                            this._alertUser()
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
                                        <View style={styles.leadHeaderContainer}>
                                            <Text style={styles.leadDetailsTitle}>Donation Details</Text>
                                            <View style={styles.leadNoContainer}>
                                                <Text style={styles.leadNo}>Lead No.: {this.props.navigation.state.params.leadNo}</Text>
                                            </View>
                                        </View>
    
                                    {/* Donation Amount  */}
                                    <Text style = {globalStyles.label}>Donation Amount<Text style={{color:"red"}}>*</Text> :</Text>
                                    <TextInput
                                        keyboardType="numeric"
                                        style = {globalStyles.inputText}
                                        onChangeText = {props.handleChange('DonationAmount')}
                                        value = {props.values.DonationAmount}
                                    />
                                    <Text style = {globalStyles.errormsg}>{props.touched.DonationAmount && props.errors.DonationAmount}</Text>
      
                                    {/* Donation Cycle */}
                                    <Text style = {globalStyles.label}>Donation Cycle <Text style={{color:"red"}}>*</Text> :</Text>
                                    <Picker
                                        selectedValue = {props.values.DonationCycle}
                                        onValueChange = {value => {
                                            props.setFieldValue('DonationCycle', value);
                                        }}
                                        style = {globalStyles.dropDown}
                                    >
                                        <Picker.Item label='DonationCycle' color='grey' value = ''/>
                                        {
                                            this.state.donationcycles.map((item) => {
                                                return <Picker.Item key = {item.DonationCycleId} label = {item.DonationCycle} value = {item.DonationCycle}/>
                                            })
                                        }
                                    </Picker>
                                    <Text style = {globalStyles.errormsg}>{props.touched.DonationCycle && props.errors.DonationCycle}</Text>
                                    
                                    {/* Remarks */}
                                    <Text style = {globalStyles.label}>Remarks <Text style={{color:"red"}}>*</Text> :</Text>
                                    <TextInput
                                        style = {globalStyles.inputText}
                                        onChangeText = {props.handleChange('Remarks')}
                                        value = {props.values.Remarks}
                                        // onBlur = {props.handleBlur('PSOName')} this can be used for real-time validation
                                    />
                                    <Text style = {globalStyles.errormsg}>{props.touched.Remarks && props.errors.Remarks}</Text>
                                    
                                    <Text style={styles.headerText}>Reporting</Text>
    
    
                                    {/* Quarterly Report Type */}

                                    <Text style = {globalStyles.label}>Quarterly Report Type <Text style={{color:"red"}}>*</Text> :</Text>
                                    <Picker
                                        selectedValue = {props.values.QuarterlyReportType}
                                        onValueChange = {value => {
                                            props.setFieldValue('QuarterlyReportType', value);
                                        }}
                                        style = {globalStyles.dropDown}
                                    >
                                        <Picker.Item label='Quarterly ReportType' color='grey' value = ''/>
                                        {
                                            this.state.reporttypes.map((item) => {
                                                return <Picker.Item key = {item.ReportTypeId} label = {item.ReportType} value = {item.ReportTypeId}/>
                                            })
                                        }
                                    </Picker>
                                    <Text style = {globalStyles.errormsg}>{props.touched.QuarterlyReportType && props.errors.QuarterlyReportType}</Text>
                                 
                                    {/* Half-Yearly Report Type */}

                                    <Text style = {globalStyles.label}>Half-Yearly Report Type <Text style={{color:"red"}}>*</Text> :</Text>
                                    <Picker
                                        selectedValue = {props.values.HalfYearlyReportType}
                                        onValueChange = {value => {
                                            props.setFieldValue('HalfYearlyReportType', value);
                                        }}
                                        style = {globalStyles.dropDown}
                                    >
                                        <Picker.Item label='Half-Yearly Report Type' color='grey' value = ''/>
                                        {
                                            this.state.reporttypes.map((item) => {
                                                return <Picker.Item key = {item.ReportTypeId} label = {item.ReportType} value = {item.ReportTypeId}/>
                                            })
                                        }
                                    </Picker>
                                    <Text style = {globalStyles.errormsg}>{props.touched.HalfYearlyReportType && props.errors.HalfYearlyReportType}</Text>                                    
                                    
                                    {/* Yearly Report Type */}
                                    <Text style = {globalStyles.label}>Yearly Report Type <Text style={{color:"red"}}>*</Text> :</Text>
                                    <Picker
                                        selectedValue = {props.values.YearlyReportType}
                                        onValueChange = {value => {
                                            props.setFieldValue('YearlyReportType', value);
                                        }}
                                        style = {globalStyles.dropDown}
                                    >
                                        <Picker.Item label='Yearly Report Type' color='grey' value = ''/>
                                        {
                                            this.state.reporttypes.map((item) => {
                                                return <Picker.Item key = {item.ReportTypeId} label = {item.ReportType} value = {item.ReportTypeId}/>
                                            })
                                        }
                                    </Picker>
                                    <Text style = {globalStyles.errormsg}>{props.touched.YearlyReportType && props.errors.YearlyReportType}</Text>    

                                    {/* // Reporting Cycle
                                    <Text style = {globalStyles.label}>Reporting Cycle <Text style={{color:"red"}}>*</Text> :</Text>
                                    <Picker
                                        selectedValue = {props.values.ReportingCycle}
                                        onValueChange = {value => {
                                            props.setFieldValue('ReportingCycle', value);
                                        }}
                                        style = {globalStyles.dropDown}
                                    >
                                        <Picker.Item label='ReportingCycle' color='grey' value = ''/>
                                        {
                                            this.state.donationcycles.map((item) => {
                                                return <Picker.Item key = {item.DonationCycleId} label = {item.DonationCycle} value = {item.DonationCycle}/>
                                            })
                                        }
                                    </Picker>
                                    <Text style = {globalStyles.errormsg}>{props.touched.ReportingCycle && props.errors.ReportingCycle}</Text> */}
                                                                                                    
                                    {/* Acknowledgement Notification */}
                                    <Text style={styles.headerText}>Acknowledgement Notification</Text>
                                    <Text style={styles.subText}>
                                        SMS/Email will be sent to Project In-charge/Accountant/National User for
                                    </Text>                                                      
    
                                    {/* Sharing of Reports Checkbox */}
    
                                    <View style={styles.checkboxContainer}>
                                    <Text style={styles.checkboxText}>Sharing of Reports</Text>
                                    <CheckBox
                                        checked={this.state.isSharingChecked}
                                        onPress={() => this.setState({isSharingChecked: !this.state.isSharingChecked})}
                                        checkedColor="#007AFF"
                                        uncheckedColor="#007AFF"
                                        containerStyle={styles.checkbox}
                                    />
                                    </View>                                
    
                                    {/* Renewal of Donor Checkbox */}
                                    <View style={styles.checkboxContainer}>
                                    <Text style={styles.checkboxText}>Renewal of Donor</Text>
                                    <CheckBox
                                        checked={this.state.isRenewalChecked}
                                        onPress={() => this.setState({isRenewalChecked: !this.state.isRenewalChecked})}
                                        checkedColor="#007AFF"
                                        uncheckedColor="#007AFF"
                                        containerStyle={styles.checkbox}
                                    />
                                    </View>
                                    <Button style = {globalStyles.button} title="Record Donation" onPress={props.handleSubmit} disabled={this.state.submitButtonDisabled}/>
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
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#D3D3D3',
        marginBottom: 10,
    },
    checkboxText: {
        fontSize: 16,
    },
    checkbox: {
        margin: 0,
        padding: 0,
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    buttonContainer: {
        marginTop: 30,
    },
    container1: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: 'purple',
        borderStyle: 'dotted',
        borderRadius: 5,
    },
    mainText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    badgeText: {
        backgroundColor: 'purple',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginLeft: 10,
        marginBottom:10
    },
    leadHeaderContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    leadDetailsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    leadNoContainer: {
        backgroundColor: '#E6E6FA',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    leadNo: {
        color: '#6A0DAD',
        fontSize: 16,
    },
    });
      
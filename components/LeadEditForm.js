import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput, Picker, Button} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { FontAwesome } from '@expo/vector-icons'; // For icons like phone, location, etc.
import {Formik} from 'formik';
import {globalStyles} from '../styles/global';
import base64 from 'react-native-base64';
import {getPassword, getUserName} from '../constants/LoginConstant';
import {base_url, getDataAsync} from '../constants/Base';
import * as yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { getUserId } from '../constants/LoginConstant';



const FollowUpSchema = yup.object({
    FollowUpDate : yup.string(),
    modeId: yup.string(),//.required(),
    assignedTo: yup.string(),//.required(),
    Remarks: yup.string(),//.required(),
});

class LeadEditForm extends Component {
    state = {
        // followUps: [
        //     { id: 1, label: 'Follow up 1', followUpDate: '28/08/2024' },
        //     { id: 2, label: 'Follow up 2', followUpDate: '28/09/2024' },
        // ],
        followUps: [],
        isModalVisible: false,
        leadDonationDetails : '',
        assignedTos : [],
        modes: [],
        followUpDate: `${moment(new Date()).format('YYYY-MM-DD')}`,
        showDatePicker: false,
        isEditing: false,  // Track if editing or adding
        currentFollowUpId: null,  // To store the ID of the follow-up being edited
        newFollowUp: {
            assignedTo: '',
            followUpDate: '',
            modeId: '',
            remarks: '',
        },
    };

    toggleModal = (followUp) => {
        this.setState({
            isModalVisible: !this.state.isModalVisible,
            newFollowUp: followUp ? { ...followUp } : { assignedTo: '', followUpDate: '', modeId: '', remarks: '' }, // Reset form when closing
            isEditing: !!followUp, // Set editing mode if followUp is provided
            currentFollowUpId: followUp ? followUp.id : null,
        });
    };

    handleConvertToDonor = () => {
        this.props.navigation.navigate('LeadContribution', {leadNo: this.props.navigation.state.params.leadNo, fromSearch: this.props.navigation.state.params.fromSearch});
    }
    async addLeadConstants(){

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
 
        getDataAsync(base_url + '/get-follow-up/'+this.props.navigation.state.params.leadNo)
        .then(data => {
            let followUpData = []
            for(let i = 0; i < data.length; i++){
                followUpData.push({
                          id: data[i].followUpId,
                          label: `Follow up ${i+1}`,
                          followUpDate: data[i].followUpDate
                        });
            }
             this.setState({followUps: followUpData})
         })
    }
    componentDidMount() {
        console.log("Mounting Data")
        
        this.setState({leadDonationDetails: this.props.navigation.state.params.leadDonationDetails})
        console.log(this.props.navigation.state.params.leadDonationDetails)
        console.log(this.state.leadDonationDetails)
        // if (this.state.leadDonationDetails === ""){
        //     const leadDonationDetailss = JSON.parse(this.props.navigation.state.params.leadDonationDetails)
        //     this.setState({leadDonationDetails: leadDonationDetailss})

        // }
        this.addLeadConstants();
    }

    async _submitAddLeadFollowupForm() {
        console.log("submit followup called");
        const { newFollowUp } = this.state;
        newFollowUp['followUpDate'] = this.state.followUpDate;
        let request_body = JSON.stringify( { ...newFollowUp, leadNo:this.props.navigation.state.params.leadNo });
        console.log(request_body);

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

    handleSaveFollowUp = async () => {
        const { followUps, newFollowUp, isEditing, currentFollowUpId } = this.state;

        if (isEditing) {
            // Edit existing follow-up
            const updatedFollowUps = followUps.map((followUp) =>
                followUp.id === currentFollowUpId
                    ? { ...followUp, followUpDate: this.state.followUpDate, assignedTo: newFollowUp.assignedTo, modeId: newFollowUp.modeId, remarks: newFollowUp.remarks } // Update all fields
                    : followUp
            );
            
            this.setState({
                followUps: updatedFollowUps,
                isModalVisible: false,
                newFollowUp: { assignedTo: '', followUpDate: '', modeId: '', remarks: '' }, // Reset form
            });
        } else {
            // Add new follow-up
            await this._submitAddLeadFollowupForm()
            const updatedFollowUps = [
                ...followUps,
                {
                    id: followUps.length + 10,
                    label: `Follow up ${followUps.length + 1}`,
                    followUpDate: this.state.followUpDate,
                },
            ];
            
            this.setState({
                followUps: updatedFollowUps,
                isModalVisible: false,
                newFollowUp: { assignedTo: '', followUpDate: '', modeId: '', remarks: '' }, // Reset form
            });
        }
    };

    handleInputChange = (field, value) => {
        this.setState({
            newFollowUp: { ...this.state.newFollowUp, [field]: value },
        });
    };

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
        const { followUps, isModalVisible, newFollowUp } = this.state;

        return (
            <View style = {globalStyles.container}>
                
            <Formik
            initialValues = {
                {
                    FollowUpDate: this.state.followUpDate,
                    modeId: '',
                    Remarks: '',
                    assignedTo: ""
                }
            }
            validationSchema = {FollowUpSchema}
            >
            {props => (
            <ScrollView contentContainerStyle={styles.container}>
                {/* Lead Details */}
                <View style={styles.leadDetails}>
                    <View style={styles.leadHeaderContainer}>
                        <Text style={styles.leadDetailsTitle}>Lead Details</Text>
                        <View style={styles.leadNoContainer}>
                            <Text style={styles.leadNo}>Lead No.: {this.props.navigation.state.params.leadNo}</Text>
                        </View>
                    </View>
                    <Text style={styles.leadSubText}>Lead was brought by {getUserName()}</Text>

                    {/* Organization Card */}
                    <View style={styles.orgCard}>
                        <View style={styles.orgHeader}>
                            <Text style={styles.orgName}>{this.state.leadDonationDetails.organisationName}</Text>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>In Progress</Text>
                            </View>
                        </View>
                        <Text style={styles.orgDetails}>Org Region: {this.state.leadDonationDetails.organisationRegion}</Text>
                        <Text style={styles.orgAddress}>
                            {this.state.leadDonationDetails.address}
                        </Text>
                        <Text style={styles.orgPhone}>{this.state.leadDonationDetails.orgContactNumber}</Text>
                    </View>
                </View>

                {/* Follow-up Section */}
                <View style={styles.followUpContainer}>
                    <Text style={styles.followUpTitle}>Follow up with the lead</Text>
                    <TouchableOpacity style={styles.addFollowUpButton} onPress={() => this.toggleModal()}>
                        <Text style={styles.addFollowUpText}>+ Add Follow up</Text>
                    </TouchableOpacity>

                    {/* Display list of Follow-ups */}
                    {followUps.map((followUp) => (
                        <TouchableOpacity
                            style={styles.followUpItem}
                            key={followUp.id}
                            // onPress={() => this.toggleModal(followUp)} // Open modal with follow-up details for editing
                        >
                            <View style={styles.followUpLabelContainer}>
                                <Text style={styles.followUpLabel}>{followUp.label}</Text>
                                <Text style={styles.followUpDate}>{followUp.followUpDate}</Text>
                            </View>
                            <FontAwesome name="chevron-right" size={16} color="#888" style={styles.arrowIcon} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Convert to Donor Button */}
                <TouchableOpacity style={styles.convertButton} onPress={this.handleConvertToDonor}>
                    <Text style={styles.convertButtonText}>CONVERT TO DONOR</Text>
                </TouchableOpacity>

                {/* Modal for Adding or Editing Follow-up */}
                <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{this.state.isEditing ? 'Edit Follow up' : 'Add Follow up'}</Text>

                            <View style={styles.inputContainer}>
                                <Text>Assigned to</Text>
                                <Picker
                                    selectedValue = {newFollowUp.assignedTo}
                                    onValueChange = {(itemValue) => this.handleInputChange('assignedTo', itemValue)}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Assigned To' color='grey' value = ''/>
                                    { 
                                        this.state.assignedTos.map((item) => {
                                            return <Picker.Item key = {item.id} label = {item.assignedTo} value = {item.id}/>
                                        })
                                    }
                                </Picker>
                            </View>



                            <View style={styles.inputContainer}>
                                <Text>Mode</Text>
                                <Picker
                                    selectedValue = {newFollowUp.modeId}
                                    onValueChange = {(itemValue) => this.handleInputChange('modeId', itemValue)}
                                    style = {globalStyles.dropDown}
                                >
                                    <Picker.Item label='Mode' color='grey' value = ''/>
                                    { 
                                        this.state.modes.map((item) => {
                                            return <Picker.Item key = {item.id} label = {item.mode} value = {item.id}/>
                                        })
                                    }
                                </Picker>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text>Remarks</Text>
                                <TextInput
                                    style={styles.textArea}
                                    value={newFollowUp.remarks}
                                    placeholder="Enter remarks"
                                    onChangeText={(value) => this.handleInputChange('remarks', value)}
                                    multiline={true}
                                />
                            </View>

                                <Text>Follow Up Date</Text>
                            <View style={{...styles.inputContainer, flexDirection: 'row', justifyContent: 'space-between' }}>

                                <View style={globalStyles.dobView}>
                                    <TextInput
                                        style = {{...styles.input, ...globalStyles.dobValue}}
                                        value = {`${moment(this.state.followUpDate).format('YYYY-MM-DD')}`}
                                        editable = {false}
                                        onValueChange = {(value) => this.handleInputChange('followUpDate', `${moment(this.state.followUpDate).format('YYYY-MM-DD')}`)} 
                                    />
                                    {/* Button to open the date picker */}
                                    {this.state.showDatePicker && 
                                        <DateTimePicker
                                        style={{width: 200}}
                                        mode="date" //The enum of date, datetime and time
                                        value={new Date() }
                                        onChange= {(e,date) => this._pickDate(e,date,props.handleChange('FollowUpDate'))} 
                                        />
                                    }
                                </View>
                                <Text style = {globalStyles.errormsg}>{props.touched.FollowUpDate && props.errors.FollowUpDate}</Text>

                            </View>
                                    <Button style={styles.dobButton} onPress={this.showDatepicker} title="Select Follow Up Date" />
                            {/* Modal Buttons */}
                            <View style={styles.modalButtonContainer}>
                                <TouchableOpacity style={styles.cancelButton} onPress={this.toggleModal}>
                                    <Text style={styles.cancelButtonText}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveButton} onPress={this.handleSaveFollowUp}>
                                    <Text style={styles.saveButtonText}>SAVE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
            )}
            </Formik>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
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
    leadDetails: {
        marginBottom: 20,
    },
    leadSubText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 15,
    },
    orgCard: {
        padding: 15,
        backgroundColor: '#F8F8FF',
        borderRadius: 8,
        marginBottom: 20,
    },
    orgHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    orgName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statusBadge: {
        backgroundColor: '#FFD700',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    orgDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    orgAddress: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    orgPhone: {
        fontSize: 14,
        color: '#666',
    },
    followUpContainer: {
        marginBottom: 20,
    },
    followUpTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addFollowUpButton: {
        backgroundColor: '#6A0DAD',
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    addFollowUpText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    followUpItem: {
        padding: 15,
        backgroundColor: '#E6E6FA',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    followUpLabelContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    followUpLabel: {
        fontSize: 14,
    },
    followUpDate: {
        fontSize: 12,
        color: '#888',
    },
    arrowIcon: {
        marginLeft: 10, // Adds some space between the text and the icon
    },
    convertButton: {
        backgroundColor: '#28a745',
        paddingVertical: 15,
        borderRadius: 5,
        marginVertical: 20,
    },
    convertButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 15,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    textArea: {
        height: 80,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
    },
    saveButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
    },
    dobButton: {
        backgroundColor: '#E6E6FA',
        borderRadius: 5,
        margin: 3,
        flex: 1,
    },
    cancelButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    saveButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default LeadEditForm;

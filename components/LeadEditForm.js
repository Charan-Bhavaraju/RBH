import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput, Picker } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For icons like phone, location, etc.
import { withNavigation } from 'react-navigation'; // For navigation props

class LeadEditForm extends Component {
    state = {
        followUps: [
            { id: 1, label: 'Follow up 1', date: '28/08/2024' },
            { id: 2, label: 'Follow up 2', date: '28/09/2024' },
        ],
        isModalVisible: false,
        isEditing: false,  // Track if editing or adding
        currentFollowUpId: null,  // To store the ID of the follow-up being edited
        newFollowUp: {
            assignedTo: '',
            date: '',
            mode: '',
            remarks: '',
        },
    };

    toggleModal = (followUp) => {
        this.setState((prevState) => ({
            isModalVisible: !prevState.isModalVisible,
            newFollowUp: followUp ? { ...followUp } : { assignedTo: '', date: '', mode: '', remarks: '' }, // Reset form when closing
            isEditing: !!followUp, // Set editing mode if followUp is provided
            currentFollowUpId: followUp ? followUp.id : null,
        }));
    };

    handleSaveFollowUp = () => {
        const { followUps, newFollowUp, isEditing, currentFollowUpId } = this.state;

        if (isEditing) {
            // Edit existing follow-up
            const updatedFollowUps = followUps.map((followUp) =>
                followUp.id === currentFollowUpId
                    ? { ...followUp, date: newFollowUp.date, assignedTo: newFollowUp.assignedTo, mode: newFollowUp.mode, remarks: newFollowUp.remarks } // Update all fields
                    : followUp
            );

            this.setState({
                followUps: updatedFollowUps,
                isModalVisible: false,
                newFollowUp: { assignedTo: '', date: '', mode: '', remarks: '' }, // Reset form
            });
        } else {
            // Add new follow-up
            const updatedFollowUps = [
                ...followUps,
                {
                    id: followUps.length + 1,
                    label: `Follow up ${followUps.length + 1}`,
                    date: newFollowUp.date,
                },
            ];

            this.setState({
                followUps: updatedFollowUps,
                isModalVisible: false,
                newFollowUp: { assignedTo: '', date: '', mode: '', remarks: '' }, // Reset form
            });
        }
    };

    handleInputChange = (field, value) => {
        this.setState({
            newFollowUp: { ...this.state.newFollowUp, [field]: value },
        });
    };

    render() {
        const { followUps, isModalVisible, newFollowUp } = this.state;

        return (
            <ScrollView contentContainerStyle={styles.container}>
                {/* Lead Details */}
                <View style={styles.leadDetails}>
                    <View style={styles.leadHeaderContainer}>
                        <Text style={styles.leadDetailsTitle}>Lead Details</Text>
                        <View style={styles.leadNoContainer}>
                            <Text style={styles.leadNo}>Lead No.: Code_E-0120</Text>
                        </View>
                    </View>
                    <Text style={styles.leadSubText}>Lead was brought by Mr. Parth Sanghi</Text>

                    {/* Organization Card */}
                    <View style={styles.orgCard}>
                        <View style={styles.orgHeader}>
                            <Text style={styles.orgName}>Organization Name</Text>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>In Progress</Text>
                            </View>
                        </View>
                        <Text style={styles.orgDetails}>Org Type: Company | Org Region: Local</Text>
                        <Text style={styles.orgAddress}>
                            Org Address
                        </Text>
                        <Text style={styles.orgPhone}>+91-Org Contact Number</Text>
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
                            onPress={() => this.toggleModal(followUp)} // Open modal with follow-up details for editing
                        >
                            <View style={styles.followUpLabelContainer}>
                                <Text style={styles.followUpLabel}>{followUp.label}</Text>
                                <Text style={styles.followUpDate}>{followUp.date}</Text>
                            </View>
                            <FontAwesome name="chevron-right" size={16} color="#888" style={styles.arrowIcon} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Convert to Donor Button */}
                <TouchableOpacity style={styles.convertButton}>
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
                                    selectedValue={newFollowUp.assignedTo}
                                    style={styles.input}
                                    onValueChange={(itemValue) => this.handleInputChange('assignedTo', itemValue)}
                                >
                                    <Picker.Item label="Person Name(s)" value="" />
                                    <Picker.Item label="John Doe" value="John Doe" />
                                    <Picker.Item label="Jane Smith" value="Jane Smith" />
                                </Picker>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text>Follow Up Date</Text>
                                <TextInput
                                    style={styles.input}
                                    value={newFollowUp.date}
                                    placeholder="Select Date"
                                    onChangeText={(value) => this.handleInputChange('date', value)}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text>Mode</Text>
                                <Picker
                                    selectedValue={newFollowUp.mode}
                                    style={styles.input}
                                    onValueChange={(itemValue) => this.handleInputChange('mode', itemValue)}
                                >
                                    <Picker.Item label="Mode" value="" />
                                    <Picker.Item label="Call" value="Call" />
                                    <Picker.Item label="Email" value="Email" />
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

export default withNavigation(LeadEditForm);

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
    newFollowUp: {
      assignedTo: '',
      date: '',
      mode: '',
      remarks: '',
    },
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  handleSaveFollowUp = () => {
    const { followUps, newFollowUp } = this.state;

    // Add the new follow-up to the list
    const updatedFollowUps = [
      ...followUps,
      {
        id: followUps.length + 1,
        label: `Follow up ${followUps.length + 1}`,
        date: newFollowUp.date,
      },
    ];

    // Update state and close modal
    this.setState({
      followUps: updatedFollowUps,
      newFollowUp: { assignedTo: '', date: '', mode: '', remarks: '' }, // Reset form
      isModalVisible: false,
    });
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
          <TouchableOpacity style={styles.addFollowUpButton} onPress={this.toggleModal}>
            <Text style={styles.addFollowUpText}>+ Add Follow up</Text>
          </TouchableOpacity>

          {/* Display list of Follow-ups */}
          {followUps.map((followUp) => (
            <View style={styles.followUpItem} key={followUp.id}>
              <Text style={styles.followUpLabel}>{followUp.label}</Text>
              <Text style={styles.followUpDate}>{followUp.date}</Text>
            </View>
          ))}
        </View>

        {/* Convert to Donor Button */}
        <TouchableOpacity style={styles.convertButton}>
          <Text style={styles.convertButtonText}>CONVERT TO DONOR</Text>
        </TouchableOpacity>

        {/* Modal for Adding Follow-up */}
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Follow up</Text>

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
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  statusText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  orgDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  orgAddress: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  orgPhone: {
    fontSize: 14,
    color: '#0000FF',
    marginBottom: 5,
  },
  detailButton: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    marginBottom: 10,
  },
  detailButtonText: {
    fontSize: 16,
    color: '#333',
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
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#E0FFFF',
    borderRadius: 5,
    marginBottom: 10,
  },
  addFollowUpText: {
    fontSize: 14,
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  followUpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  followUpLabel: {
    fontSize: 14,
  },
  followUpDate: {
    fontSize: 14,
    color: '#888',
  },
  convertButton: {
    padding: 15,
    backgroundColor: '#4682B4',
    borderRadius: 8,
    alignItems: 'center',
  },
  convertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    padding: 10,
    borderRadius: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    padding: 10,
    borderRadius: 5,
    height: 100,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#D3D3D3',
    padding: 15,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

// Wrap component to use navigation props
export default withNavigation(LeadEditForm);

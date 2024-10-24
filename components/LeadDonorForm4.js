import React from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, Picker, Image, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default class LeadDonor4 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFollowUp: false,
            assignedTo: '',
            followUpDate: new Date(),
            showDatePicker: false,
            mode: '',
            remarks: '',
        };
    }

    // Toggle follow-up switch
    toggleSwitch = () => {
        this.setState(prevState => ({ isFollowUp: !prevState.isFollowUp }));
    };

    // Show date picker
    showDatepicker = () => {
        this.setState({ showDatePicker: true });
    };

    // Handle date selection
    onDateChange = (event, selectedDate) => {
        const followUpDate = selectedDate || this.state.followUpDate;
        this.setState({ followUpDate, showDatePicker: false });
    };

    // Handle form submission
    handleSubmit = () => {
        const { assignedTo, followUpDate, mode, remarks } = this.state;
        console.log('Follow-up info:', { assignedTo, followUpDate, mode, remarks });

        // Navigate to another page after submission
        this.props.navigation.navigate('LeadEditForm');
    };

    render() {
        const { isFollowUp, assignedTo, followUpDate, showDatePicker, mode, remarks } = this.state;

        return (
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
                <Text style={styles.leadNumber}>Lead No.: Code_E-0120</Text>

                {/* Lead Brought By Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Lead Brought By*"
                    value="Mr. Parth Sanghi" // Pre-filled example
                    editable={false} // Non-editable if it's a fixed value
                />

                {/* Switch to add follow-up */}
                <View style={styles.followUpContainer}>
                    <Text style={styles.followUpText}>Do you want to add follow up?</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isFollowUp ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={this.toggleSwitch}
                        value={isFollowUp}
                    />
                </View>

                {/* Conditionally Render Follow-up Fields */}
                {isFollowUp && (
                    <>
                        {/* Assigned To Header */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Assigned to</Text>
                            <Picker
                                selectedValue={assignedTo}
                                style={styles.pickerInput}
                                onValueChange={(itemValue) => this.setState({ assignedTo: itemValue })}
                            >
                                <Picker.Item label="Person Name(s)" value="" />
                                <Picker.Item label="John Doe" value="john" />
                                <Picker.Item label="Jane Smith" value="jane" />
                            </Picker>
                        </View>

                        {/* Follow-up Date Header */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputLabel}>Follow-up Date</Text>
                            <TouchableOpacity onPress={this.showDatepicker}>
                                <TextInput
                                    style={styles.pickerInput}
                                    value={moment(followUpDate).format('DD/MM/YYYY')}
                                    editable={false}
                                    placeholder="Select Date"
                                />
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={followUpDate}
                                    mode="date"
                                    display="default"
                                    onChange={this.onDateChange}
                                />
                            )}
                        </View>

                        {/* Mode */}
                        <Picker
                            selectedValue={mode}
                            style={styles.pickerInput}
                            onValueChange={(itemValue) => this.setState({ mode: itemValue })}
                        >
                            <Picker.Item label="Mode" value="" />
                            <Picker.Item label="Phone Call" value="phone" />
                            <Picker.Item label="Email" value="email" />
                        </Picker>

                        {/* Remarks */}
                        <TextInput
                            style={styles.input}
                            placeholder="Remarks"
                            multiline
                            numberOfLines={4}
                            onChangeText={(text) => this.setState({ remarks: text })}
                            value={remarks}
                        />
                    </>
                )}

                {/* Done Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isFollowUp && assignedTo && mode ? '#4682B4' : '#B0C4DE' }]}
                    onPress={this.handleSubmit}
                    disabled={!isFollowUp || !assignedTo || !mode}
                >
                    <Text style={styles.buttonText}>DONE</Text>
                </TouchableOpacity>
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

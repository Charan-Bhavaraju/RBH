import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, Picker, Image, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default function LeadDonor4() {
    const [isFollowUp, setIsFollowUp] = useState(false);
    const [assignedTo, setAssignedTo] = useState('');
    const [followUpDate, setFollowUpDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false); // Toggle for date picker
    const [mode, setMode] = useState('');
    const [remarks, setRemarks] = useState('');

    const toggleSwitch = () => setIsFollowUp(previousState => !previousState);

    // Function to open the date picker
    const showDatepicker = () => setShowDatePicker(true);

    // Function to handle date selection
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || followUpDate;
        setShowDatePicker(false); // Close the date picker after selection
        setFollowUpDate(currentDate); // Update the selected date
    };

    return (
        <View style={styles.container}>
            {/* Success Icon */}
            <View style={styles.iconContainer}>
                <Image
                    source={require('../assets/success_icon.png')} // Your success icon path
                    style={styles.successIcon}
                />
            </View>

            {/* Lead Successfully Created Message */}
            <Text style={styles.successMessage}>Lead successfully created!</Text>
            <Text style={styles.subMessage}>
                Here is the lead no created for your reference
            </Text>

            {/* Lead Number */}
            <Text style={styles.leadNumber}>Lead No.: Code_E-0120</Text>

            {/* Lead Brought By Input */}
            <TextInput
                style={styles.input}
                placeholder="Lead Brought By*"
                value="Mr. Parth Sanghi" // Pre-filled example
                editable={false} // Make it non-editable if it's a fixed value
            />

            {/* Switch to add follow-up */}
            <View style={styles.followUpContainer}>
                <Text style={styles.followUpText}>Do you want to add follow up?</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isFollowUp ? '#f5dd4b' : '#f4f3f4'}
                    onValueChange={toggleSwitch}
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
                            style={styles.pickerInput} // Use the same style for the picker
                            onValueChange={(itemValue) => setAssignedTo(itemValue)}>
                            {/* Placeholder item */}
                            <Picker.Item label="Person Name(s)" value="" />
                            <Picker.Item label="John Doe" value="john" />
                            <Picker.Item label="Jane Smith" value="jane" />
                        </Picker>
                    </View>


                    {/* Follow-up Date Header */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Follow-up Date</Text>
                        <TouchableOpacity onPress={showDatepicker}>
                            <TextInput
                                style={styles.pickerInput}
                                value={moment(followUpDate).format('DD/MM/YYYY')}
                                editable={false} // Disable manual input
                                placeholder="Select Date"
                            />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={followUpDate}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}
                    </View>

                    {/* Mode */}
                    <Picker
                        selectedValue={mode}
                        style={styles.pickerInput}
                        onValueChange={(itemValue) => setMode(itemValue)}>
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
                        onChangeText={setRemarks}
                        value={remarks}
                    />
                </>
            )}

            {/* Done Button */}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: isFollowUp && assignedTo && mode ? '#4682B4' : '#B0C4DE' }]}
                onPress={() => console.log('Follow-up info:', { assignedTo, followUpDate, mode, remarks })}
                disabled={!isFollowUp || !assignedTo || !mode}
            >
                <Text style={styles.buttonText}>DONE</Text>
            </TouchableOpacity>
        </View>
    );
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
        borderRadius: 5, // Added border radius to match Picker
    },
    pickerInput: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        justifyContent: 'center',
        marginBottom: 20,
        borderRadius: 5, // Added border radius for consistency
    },
    dateInputWrapper: {
        width: '100%', // Ensure the TouchableOpacity covers the full width
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
    // Wrapper around the input to add padding/margin for better spacing
    inputWrapper: {
        width: '100%',
        marginBottom: 20,
    },
    // Label for the picker, like a header above the input
    inputLabel: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 5, // Adjust spacing as needed
    },
    // Style for the picker input
    pickerInput: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        justifyContent: 'center',
    },

});

import React from 'react';
import { Button, Text, TextInput, View, ScrollView, KeyboardAvoidingView, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import RadioForm from 'react-native-simple-radio-button';
import { base_url } from '../constants/Base';
import { getOrgId, getHomeCode } from '../constants/LoginConstant';

export default class SearchDonor extends React.Component {
    state = {
        showLoader: false,
        searchType: 3,
        donorsList: [],
        submitButtonDisabled: true,
        selectedDonor: null, // State to store selected donor
    };

    // API call to search sponsors
    fetchDonors = async (inputDonor) => {
        // Check if the input is numeric (for donor ID or phone number) or alphabetic (for name)
        const isNumeric = /^\d+$/.test(inputDonor);
        const isAlphabetic = /^[A-Za-z\s]+$/.test(inputDonor);

        // If input is alphabetic, only search if length is greater than or equal to 3
        if (isAlphabetic && inputDonor.length < 3) {
            this.setState({ donorsList: [], submitButtonDisabled: true });
            return;
        }

        // If input is numeric (e.g., phone number or donor ID), search regardless of length
        if (!inputDonor) {
            this.setState({ donorsList: [], submitButtonDisabled: true });
            return;
        }

        this.setState({ showLoader: true, submitButtonDisabled: true });

        try {
            const searchUrl = `${base_url}/sponsors/donor?search=${inputDonor}`;
            let result = await fetch(searchUrl);
            result = await result.json();

            if (result && result.length > 0) {
                this.setState({ donorsList: result, submitButtonDisabled: false });
            } else {
                this.setState({ donorsList: [], submitButtonDisabled: true });
            }
        } catch (error) {
            console.error(error);
            this.setState({ donorsList: [], submitButtonDisabled: true });
        } finally {
            this.setState({ showLoader: false });
        }
    };

    // Store selected donor in state and clear the donor list
    selectDonor = (donor, setFieldValue) => {
        console.log(donor);
        this.setState({ selectedDonor: donor, donorsList: [] });  // Clear the list on selection
        setFieldValue('DonorName', donor.sponsorName);  // Set the selected donor's name in the form input
        setFieldValue('SponsorNo', donor.sponsorNo);     // Store sponsorNo as well
        setFieldValue('Address', donor.address);         // Store address
        setFieldValue('Birthday', donor.birthday);       // Store birthday
        setFieldValue('EmailId', donor.emailId);         // Store emailId
        setFieldValue('MobileNo', donor.mobileNo);       // Store mobileNo
        setFieldValue('PanNumber', donor.panNumber);     // Store panNumber
    };

    componentDidMount() {
        const orgId = getOrgId();
        const homeCode = getHomeCode();
        this.setState({ orgid: orgId, homecode: homeCode });
    }

    _changeSearchType = (value, handleChange) => {
        this.setState({ searchType: value });
        handleChange(value);
    };

    render() {
        const radio_props = [
            { label: 'Individual', value: '1' },
            { label: 'Lead', value: '2' },
            { label: 'Corporate donation', value: '3' },
        ];

        return (
            <View style={styles.fullScreenContainer}>
                <Formik
                    initialValues={{
                        DonorName: '',
                        SponsorNo: '',
                        Address: '',         // Add Address to initial values
                        Birthday: '',        // Add Birthday to initial values
                        EmailId: '',        // Add EmailId to initial values
                        MobileNo: '',       // Add MobileNo to initial values
                        PanNumber: '',      // Add PanNumber to initial values
                        SearchType: 1,
                    }}
                >
                    {({ handleChange, setFieldValue, values }) => (
                        <KeyboardAvoidingView behavior="padding" enabled style={styles.keyboardAvoid}>
                            <View style={{ position: 'absolute', top: '45%', right: 0, left: 0, zIndex: this.state.showLoader ? 1 : -1 }}>
                                <ActivityIndicator animating={this.state.showLoader} size="large" color="red" />
                            </View>

                            <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollViewContent}>
                                <View style={styles.topView}>
                                    {/* Background Logo */}
                                    <View style={styles.logoContainer}>
                                        <Image source={require('../assets/RBHlogoicon.png')} style={styles.logo} />
                                    </View>

                                    {/* Search Form */}
                                    <View style={styles.formContainer}>
                                        <Text>Search Type:{'\n'}</Text>
                                        <RadioForm
                                            style={{ marginLeft: 10 }}
                                            radio_props={radio_props}
                                            buttonSize={10}
                                            buttonOuterSize={20}
                                            buttonColor={'black'}
                                            buttonInnerColor={'black'}
                                            selectedButtonColor={'blue'}
                                            onPress={value => this._changeSearchType(value, handleChange('SearchType'))}
                                        />
                                        <TextInput
                                            placeholder="Enter Donor name / Donor id / Phone number"
                                            style={styles.inputText}
                                            onChangeText={searchInput => {
                                                handleChange('DonorName')(searchInput);
                                                this.fetchDonors(searchInput);
                                            }}
                                            value={values.DonorName}
                                        />

                                        {/* Donor List Display */}
                                        {this.state.donorsList.length > 0 ? (
                                            <>
                                                {/* Display the search query above the results */}
                                                <Text style={styles.searchResultsText}>
                                                    Search results for: "{values.DonorName}"
                                                </Text>
                                                {this.state.donorsList.map((item, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        style={[styles.donorItem, this.state.selectedDonor === item && styles.selectedDonorItem]}
                                                        onPress={() => this.selectDonor(item, setFieldValue)}  // Clear results after selection
                                                    >
                                                        <Text style={styles.donorText}>
                                                            {item.sponsorName} (Sponsor No: {item.sponsorNo})
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                                {/* Display "End of search results" after the last donor */}
                                                <Text style={styles.endOfResultsText}>
                                                    End of search results for: "{values.DonorName}"
                                                </Text>
                                            </>
                                        ) : (
                                            // Only display "No donors found" if no results and no donor is selected
                                            values.DonorName.length > 0 && !this.state.showLoader && !this.state.selectedDonor && (
                                                <Text>No donors found</Text>
                                            )
                                        )}


                                    </View>

                                    {/* Submit Button */}
                                    <Button
                                        title="DONATE"
                                        onPress={() => {
                                            // Navigate to the AddDonor screen, passing the Formik values and selected donor
                                            this.props.navigation.navigate('AddDonor', {
                                                navigation: this.props.navigation,
                                                selectedDonor: this.state.selectedDonor,
                                                formikValues: values,  // Pass Formik values
                                            });
                                        }}
                                        disabled={!this.state.selectedDonor} // Disable if no donor selected
                                    />

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
    fullScreenContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollViewContent: {
        paddingVertical: 20,
    },
    topView: {
        padding: 20,
    },
    logoContainer: {
        position: 'absolute',
        top: '10%',
        right: 0,
        left: 0,
        zIndex: -2,
    },
    logo: {
        resizeMode: 'cover',
        opacity: 0.2,
        marginTop: '10%',
        marginLeft: '29%',
    },
    formContainer: {
        marginTop: '5%',
        marginBottom: '5%',
    },
    inputText: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingVertical: 5,
        marginBottom: 20,
    },
    searchResultsText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#000',
    },
    donorItem: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selectedDonorItem: {
        backgroundColor: '#c0e8ff', // Highlight selected donor
    },
    donorText: {
        fontSize: 16,
    },
    endOfResultsText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#000',
        textAlign: 'center', // Center the message
    },
});

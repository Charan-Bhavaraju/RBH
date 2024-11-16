import React from 'react';
import { Button, Text, TextInput, View, ScrollView, KeyboardAvoidingView, Image, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import RadioForm from 'react-native-simple-radio-button';
import { base_url } from '../constants/Base';
import { getOrgId, getHomeCode } from '../constants/LoginConstant';
import { setSelectedDonor } from '../constants/DonorConstants';
import Icon from 'react-native-vector-icons/Feather';
import {globalStyles} from '../styles/global';


export default class SearchDonor extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        showLoader: false,
        searchType: 1,
        donorsList: [],
        searchClicked:false,
        submitButtonDisabled: true,
        selectedDonor: null, // State to store selected donor
    };

    // API call to search sponsors
    // Update the fetchDonors function
    fetchDonors = async (inputDonor) => {
        // Check if the input is numeric (for donor ID or phone number) or alphabetic (for name)
        const isNumeric = /^\d+$/.test(inputDonor);
        const isAlphabetic = /^[A-Za-z\s]+$/.test(inputDonor);
        this.state.searchClicked = true

        if (isAlphabetic && inputDonor.length < 3) {
            this.setState({ donorsList: [], submitButtonDisabled: true });
            return;
        }

        if (!inputDonor) {
            this.setState({ donorsList: [], submitButtonDisabled: true });
            return;
        }

        this.setState({ showLoader: true, submitButtonDisabled: true });
        // console.log(inputDonor)
        try {
            // Determine the endpoint based on searchType
            let endpoint = '';
            if (this.state.searchType == 1) {
                endpoint = 'sponsors/donor';
            } else if (this.state.searchType == 2 ) {
                endpoint = 'get-lead';
            } else if (this.state.searchType == 3) {
                endpoint = 'get-converted-lead';
            }
            

            const searchUrl = `${base_url}/${endpoint}?search=${inputDonor}`;
            let result = await fetch(searchUrl);
            result = await result.json();
            console.log(searchUrl);
            console.log(this.state.searchType);

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

    // Update the _changeSearchType function
    _changeSearchType = (value, handleChange) => {
        this.setState({ 
            searchType: value, 
            donorsList: [],        // Clear search results
            selectedDonor: null,   // Clear selected donor
            submitButtonDisabled: true // Disable the submit button
        })
        console.log(value)
        handleChange(value); // Update the formik value for search type
    };

    // Store selected donor in state and clear the donor list
    selectDonor = (donor, setFieldValue) => {
        console.log(donor);
    
        // Clear the donor list on selection and set the selected donor
        this.setState({ selectedDonor: donor, donorsList: [] });
    
        if (this.state.searchType === 1) {
            // For Individual type (searchType === 1)
            setFieldValue('DonorName', donor.sponsorName);
            setFieldValue('SponsorNo', donor.sponsorNo);
            setFieldValue('Address', donor.address);
            setFieldValue('Birthday', donor.birthday);
            setFieldValue('EmailId', donor.emailId);
            setFieldValue('MobileNo', donor.mobileNo);
            setFieldValue('PanNumber', donor.panNumber);
    
        } else if (this.state.searchType === 2 || this.state.searchType === 3) {
            // For Lead or Corporate Donation types (searchType === 2 or 3)
            setFieldValue('organisationName', donor.organisationName);
            setFieldValue('leadOrganisationTypeId', donor.leadOrganisationTypeId);
            setFieldValue('organisationRegion', donor.organisationRegion);
            setFieldValue('address', donor.address);
            setFieldValue('orgContactNumber', donor.orgContactNumber);
            setFieldValue('pointOfContactName', donor.pointOfContactName);
            setFieldValue('email', donor.email);
            setFieldValue('pocContactNumber', donor.pocContactNumber);
            setFieldValue('expectedAmount', donor.expectedAmount);
            setFieldValue('followUp', donor.followUp);
            setFieldValue('leadBroughtBy', donor.leadBroughtBy);
            setFieldValue('willingToSupport', donor.willingToSupport);
        }
    };
    
    render() {
        const radio_props = [
            { label: 'Individual', value: '1' },
            { label: 'Lead', value: '2' },
            { label: 'Corporate donation', value: '3' },
        ];

        return (
            <View  style = {globalStyles.container}>
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
                        ...(this.state.searchType === 2 || this.state.searchType === 3 ? {
                            organisationName: '',
                            leadOrganisationTypeId: '',
                            organisationRegion: '',
                            orgContactNumber: '',
                            pointOfContactName: '',
                            email: '',
                            pocContactNumber: '',
                            expectedAmount: '',
                            followUp: '',
                            leadBroughtBy: '',
                            willingToSupport: '',
                        } : {})
                    }}
                    onSubmit = {async (values, actions) => { 
                        if (this.state.searchType == 2 ) { // Lead or Corporate Donation
                            console.log("Navigating to Edit lead",this.state.selectedDonor)
                            this.props.navigation.navigate('LeadEdit', {
                                navigation: this.props.navigation,
                                leadDonationDetails: this.state.selectedDonor,
                                leadNo: this.state.selectedDonor['leadNo'],
                                formikValues: values,
                                fromSearch: true
                            });
                            return
                        } 
                        else if (this.state.searchType == 3) { // Lead or Corporate Donation
                            console.log("Navigating to lead contribution",this.state.selectedDonor)
                            this.props.navigation.navigate('LeadContribution', {
                                navigation: this.props.navigation,
                                leadDonationDetails: this.state.selectedDonor,
                                leadNo: this.state.selectedDonor['leadNo'],
                                formikValues: values,
                                fromSearch: true
                            });
                            return
                        } 
                        else {
                            console.log("Navigating to Donor", this.state.selectedDonor)
                            setSelectedDonor(this.state.selectedDonor); // Store the selected donor

                            // Individual Donor case
                            this.props.navigation.navigate('AddDonor', {
                                navigation: this.props.navigation,
                                selectedDonor: this.state.selectedDonor,
                                formikValues: values,
                            });
                        }
                    }}
                    >
                    {props => (
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
                                            onPress={value => this._changeSearchType(value, props.handleChange('SearchType'))}
                                        />
          
                                        {/* Search Input with Button */}
                                        <View style={styles.searchContainer}>
                                            <TextInput
                                            placeholder="Enter Donor name / Donor id / Phone number"
                                            style={styles.inputText}
                                            onChangeText={props.handleChange('DonorName')}
                                            value={props.values.DonorName}
                                            />
                                            <TouchableOpacity style={styles.searchButton} onPress={() => this.fetchDonors(props.values.DonorName)}>
                                            <Icon name="search" size={20} color="white" />
                                            </TouchableOpacity>
                                        </View>

                                        {/* Donor List Display */}
                                        {this.state.donorsList.length > 0 ? (
                                            <>
                                                {/* Display the search query above the results */}
                                                <Text style={styles.searchResultsText}>
                                                    Search results for: "{props.values.DonorName}"
                                                </Text>
                                                {this.state.donorsList.map((item, index) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        style={[styles.donorItem, this.state.selectedDonor === item && styles.selectedDonorItem]}
                                                        onPress={() => this.selectDonor(item, props.setFieldValue)}  // Clear results after selection
                                                    >
                                                        {this.state.searchType === 1 ? (
                                                        <Text style={styles.donorText}>
                                                            {item.sponsorName} (Sponsor No: {item.sponsorNo})
                                                        </Text>
                                                        ) : 
                                                        <Text style={styles.donorText}>
                                                        {item.organisationName} (Sponsor No: {item.leadNo})
                                                        </Text>
                                                    }
                                                    </TouchableOpacity>
                                                ))}
                                                {/* Display "End of search results" after the last donor */}
                                                <Text style={styles.endOfResultsText}>
                                                    End of search results for: "{props.values.DonorName}"
                                                </Text>
                                            </>
                                        ) : (
                                            // Only display "No donors found" if no results and no donor is selected
                                            props.values.DonorName.length > 0 && this.state.searchClicked && !this.state.showLoader && !this.state.selectedDonor && (
                                                <Text>No donors found</Text>
                                            )
                                        )}


                                    </View>

                                    {/* Submit Button */}
                                    <Button style = {globalStyles.button} title="Donate" onPress={props.handleSubmit} />

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
      searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  searchButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
});

import React, {useState} from 'react';
import {Button, Text, TextInput, View, ScrollView, KeyboardAvoidingView, Image, ActivityIndicator, StyleSheet} from 'react-native';
import {Formik} from 'formik';
import {globalStyles} from '../styles/global';
import RadioForm from 'react-native-simple-radio-button';
import {base_url} from '../constants/Base';
import {getOrgId, getHomeCode} from '../constants/LoginConstant';

export default class SearchDonor extends React.Component {
    state = {
        showLoader: false,
        searchType: 3,
        donorsList: [],
        submitButtonDisabled: true,
    };

    fetchDonors = async (inputDonor) => {
        if (!inputDonor) return;
        this.setState({showLoader: true, submitButtonDisabled: true});

        try {
            const searchUrl = `${base_url}/sponsors/donor?search=${inputDonor}`;
            let result = await fetch(searchUrl);
            result = await result.json();

            if (result && result.length > 0) {
                this.setState({donorsList: result, submitButtonDisabled: false});
            } else {
                this.setState({donorsList: [], submitButtonDisabled: true});
            }
        } catch (error) {
            console.error(error);
            this.setState({donorsList: [], submitButtonDisabled: true});
        } finally {
            this.setState({showLoader: false});
        }
    };

    componentDidMount() {
        const orgId = getOrgId();
        const homeCode = getHomeCode();
        this.setState({orgid: orgId, homecode: homeCode});
        console.log(this.state.homeCode);
    }

    _changeSearchType = (value, handleChange) => {
        this.setState({searchType: value});
        handleChange(value);
    };

    render() {
        const radio_props = [
            {label: 'Individual', value: '1'},
            {label: 'Lead', value: '2'},
            {label: 'Corporate donation', value: '3'},
        ];

        return (
            <View style={styles.fullScreenContainer}>
                <Formik
                    initialValues={{
                        DonorName: '',
                        SearchType: 1,
                    }}
                >
                    {props => (
                        <KeyboardAvoidingView behavior="padding" enabled style={styles.keyboardAvoid}>
                            <View style={{position: 'absolute', top: '45%', right: 0, left: 0, zIndex: this.state.showLoader ? 1 : -1}}>
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
                                            style={{marginLeft: 10}}
                                            radio_props={radio_props}
                                            buttonSize={10}
                                            buttonOuterSize={20}
                                            buttonColor={'black'}
                                            buttonInnerColor={'black'}
                                            selectedButtonColor={'blue'}
                                            onPress={value => this._changeSearchType(value, props.handleChange('SearchType'))}
                                        />
                                        <TextInput
                                            placeholder="Enter Donor name / Donor id"
                                            style={styles.inputText}
                                            onChangeText={searchInput => {
                                                props.handleChange('DonorName')(searchInput);
                                                this.fetchDonors(searchInput);
                                            }}
                                        />

                                        {/* Donor List Display */}
                                        {this.state.donorsList.length > 0 ? (
                                            this.state.donorsList.map((item, index) => (
                                                <View key={index}>
                                                    <Text>{item.sponsorName}</Text>
                                                </View>
                                            ))
                                        ) : (
                                            <Text>No donors found</Text>
                                        )}
                                    </View>

                                    {/* Submit Button */}
                                    <Button
                                        title="DONATE"
                                        onPress={() => this.props.navigation.navigate('AddDonor', {navigation: this.props.navigation})}
                                        disabled={this.state.submitButtonDisabled}
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
        paddingVertical: 20, // Optional: Space around content
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
});

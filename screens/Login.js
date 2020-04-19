import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import {base_url} from '../constants/Base';
import { setOrgId, getOrgId } from '../constants/LoginConstant'

export default class Login extends Component {


    state = {
        username: '',
        password: '',
        isLoggingIn: false,
        message: '',
        showLoader: false,
        loaderIndex: 0,
    }

    componentDidMount() {
        setOrgId(5);
    }

    updateOrgId(id) {
        setOrgId(id);
    }

    _userLogin = () => {
        this.setState({ isLoggingIn: true, message: 'Logging In, Please wait' });
        this.setState({ showLoader: true, loaderIndex: 10 });
        let request_body = JSON.stringify({
            "userName": this.state.username,
            "password": this.state.password,
        });
        fetch(base_url+"/user-login", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log("*******");
            console.log(responseJson);
            if(responseJson.authStatus == true) {
                this.setState({ isLoggingIn: false, message: '' });
                this.setState({showLoader: false,loaderIndex:0});
                console.log(responseJson.orgId);
                console.log(getOrgId());
                this.updateOrgId(responseJson.orgId);
                console.log("=========");
                this.props.onLoginPress();
            }
            else {
                this.setState({ isLoggingIn: false, message: responseJson.comments });
                this.setState({showLoader: false,loaderIndex:0});
            }
        })
        // if(this.state.username == "admin" && this.state.password == "admin") {
        //     if(this.props.onLoginPress) {
        //         this.props.onLoginPress();
        //         this.setState({ isLoggingIn: false, message: 'Please enter a valid usernam and password' });
        //     }
        //     else {
        //         this.props.navigation.navigate('Home');
        //     }
        // }
        // else {
        //     this.setState({ isLoggingIn: false, message: 'Please enter a valid usernam and password' });
        // }
    }

    clearUsername = () => {
        this._username.setNativeProps({ text: '' });
        this.setState({ message: '' });
    }

    clearPassword = () => {
        this._password.setNativeProps({ text: '' });
        this.setState({ message: '' });
        this.setState({isLoggingIn: false});
    }

    render() {
        return (
            <View style={titlestyle.container}>
            <ScrollView >
                <Text>
                    Login into the App
                </Text>
                <TextInput
                    ref={component => this._username = component}
                    onChangeText={(username) => this.setState({username})}
                    autoFocus={true}
                    placeholder='Username'
                />
                <TextInput
                    ref={component => this._password = component}
                    placeholder='Password'
                    onChangeText={(password) => this.setState({password})}
                    secureTextEntry={true}
                    onFocus={this.clearPassword}
                    onSubmitEditing={this._userLogin}
                />
                {!!this.state.message && (
                    <Text
                	    style={{fontSize: 14, color: 'blue', padding: 5}}>
                		{this.state.message}
                	</Text>
                )}
                <View style={{margin:7}} />
                <Button
                    disabled={this.state.isLoggingIn||!this.state.username||!this.state.password}
                    onPress={this._userLogin}
                    title="Submit"
                />
            </ScrollView>
            <View style={{ position: 'absolute', top:"50%",right: 0, left: 0, zIndex: this.state.loaderIndex }}>
                    <ActivityIndicator animating={this.state.showLoader} size="large" color="red" />
                </View>
            </View>
            )
    }
}

const titlestyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    padding: 20
  },
});
import React, { Component } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    View,
    Button,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView ,
    Image,
    Switch,
    AsyncStorage
} from 'react-native';
import {base_url} from '../constants/Base';
import {globalStyles} from '../styles/global';
import { setOrgId, getOrgId, setHomeCode, getHomeCode, setUserName, setPassword } from '../constants/LoginConstant'
import base64 from 'react-native-base64';

export default class Login extends Component {


    state = {
        username: '',
        password: '',
        isLoggingIn: false,
        message: '',
        showLoader: false,
        loaderIndex: 0,
        rememberMe: false,
    }

    rememberUser = async () => {
        try {
            console.log("remembering user");
          await AsyncStorage.setItem('RBH_USR', this.state.username);
          await AsyncStorage.setItem('RBH_PWD',this.state.password);
        } catch (error) {
            console.log("remembering user error")
        }
    };
    
    getRememberedUser = async () => {
        try {
            console.log("getting user")
          const username = await AsyncStorage.getItem('RBH_USR');
          const password = await AsyncStorage.getItem('RBH_PWD');
          if (username !== null && password !== null) {
              this.setState({
                  'username': username || "",
                  'password': password || ""
              })
            return {'username': username, 'password': password}
          }
        } catch (error) {
          // Error retrieving data
          console.log("getting user error")
        }
    };
    
    forgetUser = () => {
          try {
            AsyncStorage.removeItem('RBH_USR');
            AsyncStorage.removeItem('RBH_PWD');
          } catch (error) {
           // Error removing
          }
    };

    toggleRememberMe = value => {
        this.setState({ rememberMe: value })
          if (value === true) {
        //user wants to be remembered.
          this.rememberUser();
        } else {
          this.forgetUser();
        }
    }

    componentDidMount() {
        let user_data = this.getRememberedUser();
    }

    updateOrgId(id) {
        setOrgId(id);
    }

    updateHomeCode(code) {
        setHomeCode(code);
        setUserName(this.state.username);
        setPassword(this.state.password)
    }

    _userLogin = () => {
        if(this.state.rememberMe) {
            this.rememberUser();
        }
        else {
            this.forgetUser();
        }
        this.setState({ isLoggingIn: true, message: 'Logging In, Please wait' });
        this.setState({ showLoader: true, loaderIndex: 10 });
        let request_body = JSON.stringify({
            "userName": this.state.username,
            "password": this.state.password,
        });
        console.log("request body: " + request_body);
        console.log("request body: " + base_url+"/user-login")
        fetch(base_url+"/user-login", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: request_body,
        })
        .then((response) => {
            console.log("response:" + response)
            console.log("response json:" + response.json)
            console.log("response:" + response.ok)
            if(response.ok) {
                response.json().then((responseJson) => {
                    console.log("*******Login json********");
                    console.log(responseJson);
                    console.log("*************************")
                    if(responseJson.authStatus == true) {
                        this.setState({ isLoggingIn: false, message: '' });
                        this.setState({showLoader: false,loaderIndex:0});
                        console.log(responseJson.orgId);
                        console.log(getOrgId());
                        this.updateOrgId(responseJson.orgId);
                        this.updateHomeCode(responseJson.homeCode);
                        console.log(getHomeCode());
                        console.log("=========");
                        this.props.onLoginPress();
                    }
                    else {
                        this.setState({ isLoggingIn: false, message: responseJson.comments });
                        this.setState({showLoader: false,loaderIndex:0});
                    }
                })
            }
            else {
                throw Error(response.status);
            }
        })
        .catch((error)=> {
            console.log("This is error: " + error);
            this.setState({ isLoggingIn: false, message: responseJson.comments });
            this.setState({showLoader: false,loaderIndex:0});
        })
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
            <KeyboardAvoidingView behavior="null"
                                                    enabled style={globalStyles.keyboardavoid}
                                                    keyboardVerticalOffset={0}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={titlestyle.container}>
                <Image source={ require('../assets/RBHsmall.png') } style = {titlestyle.logoicon}/>
                <Text style={titlestyle.header}>
                    Login
                </Text>
                <TextInput
                    ref={component => this._username = component}
                    onChangeText={(username) => this.setState({username})}
                    placeholder='Username'
                    style = {titlestyle.inputText}
                    defaultValue = {this.state.username}
                    value = {this.state.username}
                />
                <TextInput
                    ref={component => this._password = component}
                    placeholder='Password'
                    onChangeText={(password) => this.setState({password})}
                    secureTextEntry={true}
                    onFocus={this.clearPassword}
                    onSubmitEditing={this._userLogin}
                    style = {titlestyle.inputText}
                    defaultValue = {this.state.password}
                    value = {this.state.password}
                />
                {!!this.state.message && (
                    <Text
                	    style={{fontSize: 14, color: 'blue', padding: 5}}>
                		{this.state.message}
                	</Text>
                )}
                <View style={{margin:7}} />
                <View style={{display:'flex', flexDirection: 'row', justifyContent:'flex-start', marginBottom: 10}}>
                    <Switch
                    value={this.state.rememberMe}
                    onValueChange={(value) => this.toggleRememberMe(value)}
                    style={{}}
                    />
                    <Text style={{fontSize:16}}>Remember Me</Text>
                </View>
                <Button
                    disabled={this.state.isLoggingIn||!this.state.username||!this.state.password}
                    onPress={this._userLogin}
                    title="Submit"
                />
                {/* <Image source={ require('../assets/RBHlogotext.png') } style = {titlestyle.logotext}/> */}
            <View style={{ position: 'absolute', top:"60%",right: 0, left: 0, zIndex: this.state.loaderIndex }}>
                    <ActivityIndicator animating={this.state.showLoader} size="large" color="red" />
                </View>
            </View>
            </ScrollView>
            </KeyboardAvoidingView>
            )
    }
}

const titlestyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    padding: 20,

  },
  header: {
    marginLeft: '40%',
    marginTop: '10%',
    fontSize: 20,
    marginBottom: '2%',
  },
  inputText: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    fontSize: 18,
    borderRadius: 6,
    borderColor: 'lightgreen',
  },
  logoicon: {
      marginTop: '40%',
      marginLeft: '5%',
  },
  logotext: {
      marginTop: '20%',
      marginLeft: '25%',
  }

});
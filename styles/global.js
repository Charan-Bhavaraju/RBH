import { StyleSheet, Dimensions } from 'react-native';
import { AuthSession } from 'expo';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const globalStyles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f0f0f0'
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    formcontainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#000000',
        padding: 20,
        fontSize: 18,
        borderRadius: 6
    },
    touchableBox: {
        padding: 10,
        fontSize: 18,
        borderRadius: 6,

        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'black'
    },
    disabledBox: {
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
        backgroundColor: '#fafafa',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'black'
    },
    inputform: {
        borderWidth: 3,
        borderColor: '#ddd',
        padding: 20,
        fontSize: 18,
        borderRadius: 6,
        marginLeft: 10,
        marginRight: 15,
    },
    inputText: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        fontSize: 18,
        borderRadius: 6,
        borderColor: 'black',
    },
    // dropDown: {
    //     backgroundColor: '#fafafa',
    //     borderWidth: 1,
    //     borderColor: '#000000',
    //     padding: 10,
    //     fontSize: 18,
    //     borderRadius: 6,
    //     marginBottom: 1,
    //     flexWrap: 'wrap'
    // },
    PageHeaderView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    PageHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dropDown: {
        marginTop: -7,
        borderColor: 'black',
        borderWidth: 1,
    },
    text: {
        padding: 10,
        color: '#000000',
        fontSize: 17,
        fontWeight: 'bold',
        borderColor: '#000000'
    },
    dateView: {
        flex: 1,
        flexDirection: 'row',
    },
    dateValue: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        fontSize: 18,
        borderRadius: 6,
        flex: 3,
    },
    dateBtn: {
        marginLeft: 4,
        flex: 2,
        fontSize: 35,
        marginTop: 4
    },
    textform: {
        padding: 10,
        color: '#000000',
        fontSize: 16,
        borderBottomColor: '#000000',
        marginBottom: 5,
        marginTop: 5,
        marginRight: 15,
        fontWeight: 'bold',
    },
    button: {
        color: 'blue',
        padding: 10,
        borderRadius: 6,
        fontSize: 18,
        position: 'relative',
        paddingTop: 10,
        marginBottom: 5,
    },
    errormsg: {
        padding: 1,
        color: 'crimson',
        fontWeight: 'bold',
        fontSize: 10,
    },
    keyboardavoid: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    formheading: {
        fontSize: 24,
        alignSelf: 'center',
        marginBottom: 20
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    homeView: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    addChildBtn: {
        padding: 15,
        backgroundColor: 'black',
        color: 'black',
    },
    vuChildBtn: {
        padding: 30,
        backgroundColor: 'black',
        color: 'black',
    },
    ModelBtn: {
        padding: 30,
        backgroundColor: 'black',
        color: 'black',
        width: 20
    },
    homeTextView: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingLeft: Dimensions.get('window').width / 120.5
    },
    homeScreenText: {
        top: '-80%',
        padding: 5,
        fontSize: 15,
        position: 'relative'
    },
    homeScreenTextContainer: {
        // flex: 2,
        position: 'relative',
        // top: Dimensions.get('window').height / 14,
        // left: Dimensions.get('window').width / 6,
        top: hp('13%'),
        left: wp('17%'),
        padding: 15
    },
    errormsgform: {
        padding: 1,
        color: 'crimson',
        fontWeight: 'bold',
        fontSize: 10,
        marginLeft: 10,
        marginRight: 15
    },
    scrollContainer: {
        flex: 1,
        padding: 5
    },
    segScrollView: {
        height: 0
    },
    segView: {
        height: 50
    },
    spinnerTextStyle: {
        color: '#FF0000'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        width: Dimensions.get('window').width / 2 + 50,
        maxHeight: Dimensions.get('window').height / 4,
        top: 150,
        borderRadius: 30
    },
    MainContainer: {
        justifyContent: 'space-between',
        flex: 1,
    },
    label: {
        fontSize: 14,
        paddingTop: 5,
        paddingBottom: 2,
        paddingLeft: 5,
        fontWeight: 'bold',
    },
    homescreenlogoimageview: {
        position: 'relative',
        // top: Dimensions.get('window').height / 50 - 35,
        top: hp('5%'),
        right: wp('3%'),
        // left: wp('15%'),
        zIndex: -2,
    },
    backgroundlogoimageview: {
        position: 'absolute', top: "20%", right: 0, left: 0, zIndex: -2,
    },
    homescreenButtonStyle: {
        position: 'relative',
        flexDirection: 'row',
        // top: Dimensions.get('window').height / 10,
        // left: Dimensions.get('window').width / 15
        top: hp('8%'),
        left: wp('4.5%'),
    },
    HeadStyle: { 
        height: hp('5%'),
        alignContent: "center"
      },
      TableText: { 
        margin: hp('1%')
    },
    backgroundlogoimage: {
        opacity: 0.2,
        marginTop: '30%',
        marginLeft: '29%'
    },
    homepagelogoimage: {
        opacity: 0.2,
        marginTop: '10%',
        marginLeft: '29%'
    },
    uploadpicbutton: {
        width: '50%',
        marginBottom: 5,
    },
    topView: {
        flex: 4,
        paddingTop: 5,
    },
    uploadImage: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: '25%',
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "black"
    },
    dobView: {
        flex: 1,
        flexDirection: 'row',
    },
    dobValue: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        fontSize: 18,
        borderRadius: 6,
        flex: 3,
        borderColor: 'black',
    },
    dobBtn: {
        marginLeft: 2,
        flex: 2,
        fontSize: 40,
    },
    prevnext: {
        flex: 1,
        flexDirection: 'row',
    },
    prevnextsubview: {
        width: '50%',
    },
    prevnextbuttons: {
        marginTop: '10%',
        fontSize: 16,
        marginLeft: '40%',
        color: 'green',
    },
    prevnextbuttonsgrey: {
        marginTop: '10%',
        fontSize: 16,
        marginLeft: '40%',
        color: 'grey',
    },
    modalButton: {
        color: 'blue',
        padding: 10,
        borderRadius: 6,
        marginBottom: 5,
        fontSize: 14,

    },
    Header: {
        padding: 5,
        textAlign: "center",
        color: '#000000',
        fontSize: 25,
        borderBottomColor: '#000000'
    },
    healthformheading: {
        fontSize: 18,
        alignSelf: 'center',
        marginBottom: 15,
        marginTop: 0,
        backgroundColor: '#48BBEC',
        color: 'white',
        borderWidth: 1,
        borderRadius: 8
    },
    closeModalIcon: {
        left: Dimensions.get('window').width / 2.5,
        top: Dimensions.get('window').height / 70,
    },
    feedbackContainer: {
        flex: 1
    }
});



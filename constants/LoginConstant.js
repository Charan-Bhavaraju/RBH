import { EventRegister } from 'react-native-event-listeners';

global.OrgId = 0;

global.OrgLevelId = 0;

global.HomeCode = 0;

global.username = '';

global.password = '';

global.userId = 0;

global.rainbowHome = {};

export function getOrgId() {
    return global.OrgId;
}

export function setOrgId(id) {
    console.log(id);
    global.OrgId = id;
}

export function setHomeCode(code) {
    console.log(code);
    global.HomeCode = code;
}

export function getHomeCode() {
    return global.HomeCode;
}

export function logOut() {
	EventRegister.emit('logoutEvent',' Logging out ');
}

export function setUserName(username) {
    console.log(username);
    global.username = username;
}

export function getUserName() {
    return global.username; 
}

export function setUserId(userId) {
    console.log(userId);
    global.userId = userId;
}

export function getUserId() {
    return global.userId; 
}

export function setOrgLevelId(OrgLevelId) {
    console.log(OrgLevelId);
    global.OrgLevelId = OrgLevelId;
}

export function getOrgLevelId() {
    return global.OrgLevelId; 
}

export function setRainbowHome(rainbowHome) {
    global.rainbowHome = rainbowHome;
}

export function getRainbowHome() {
    return global.rainbowHome; 
}

export function setPassword(password) {

    global.password = password;
}

export function getPassword() {
    return global.password;
}
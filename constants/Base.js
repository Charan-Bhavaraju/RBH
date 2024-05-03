import base64 from 'react-native-base64';
import {getPassword, getUserName} from './LoginConstant';
export let base_url = 'http://10.0.2.2:8080/api/v1'

export async function getDataAsync(url){
    try{
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
            }
        });
        if(response.status == 200){
            let body = await response.json();
            return body;
        }
        else{
            let error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }
    catch (errr) {
        console.log(JSON.stringify(errr), 'ppppp');
        return [{"religion": "service unavailable", "religionID": "123"}]
    }
}

export async function postDataAsync(url = '', data = {}){
    try{
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }
    catch(err){
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

export async function putDataAsync(url, data){
    console.log('fetching data')
    let response = await fetch(url, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
        },
        body: JSON.stringify(data)
    });
    console.log(response)
    let body = await response.json();
    console.log(body)
    console.log('fetched data')
    return body;    
}

export function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
import axios from 'axios'
import api from './ApiMap.json'

export class GlaasAuth {
    
    static parseUriWithHash = (uri) => {
        var tmp = {};
        var params = uri.split('#')[1].split('&');
        for (var i=0; i<params.length; i++) {
          var key = params[i].split('=')[0];
          var val = params[i].split('=')[1];
          //chnage name of temp
          tmp[key] = val;
        }
        //console.log("Extracted token from url : "+tmp.access_token);
        return tmp.access_token;
    }

    static authenticate() {
        const glaasAuthUrl = api.glaasUrl+api.glaasAuthApi+api.clientId;
        window.location.href = glaasAuthUrl;
    }
    
    static async checkSession(authToken) {
        return await new Promise( (resolve, reject) => {
            const postHeaders = {
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'Accept' : 'application/json',
                    'Authorization' : api.clientId+':'+authToken
                } 
            }
            
            axios.post(api.glaasUrl+api.glaasCheckSessionApi, null, postHeaders )
            .then((response) => {
                if(response.status === 200){
                    console.log("Check session - success");
                    resolve(response.data);
                }
                    
                else if(response.status === 401){
                    console.log("Check session - unauthorized\n Initiating auth")
                    this.authenticate();
                }
            })
            .catch(error => {
                if(error.response.status === 500 || error.response.status === 401){
                    console.log("Check session - fail, calling authenticate()")
                    this.authenticate();
                }
                    
                if (error.response) {
                    reject(error.response.data);
                }
                else if (error.request) {
                    reject("Response not recieved");
                }
                else {
                    reject(error.stack);
                }
            })
        })
        //env dependent glaas url to be used
    }

    static initiate(){
        let authToken = null;
        if(window.location.href.includes("access_token")) {
            authToken = this.parseUriWithHash(window.location.href);
            console.log("Extracted authToken from window address")
        }
        else {
            authToken = localStorage.getItem("pquaAuthToken");
            console.log("Extracted authToken from storage")
        }
        console.log("Performing checkSession call")
        this.checkSession(authToken)
        .then((response) => {
            console.log("Saving validated authToken & expiration time")
            localStorage.setItem('pquaAuthToken', authToken);
            localStorage.setItem('pquaAuthTokenExpires', response.expiresOn);
            console.log("Saving user info to localStorage")
            localStorage.setItem('userLdap',response.ldap);
            localStorage.setItem('userName', response.name);
            localStorage.setItem('userEmail', response.email);
        })
        .catch((error) => {
            console.log(error);
            console.log("Removing user info from localStorage")
            localStorage.clear();
        })
    }
    
}

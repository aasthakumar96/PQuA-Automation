import axios from 'axios';
import api from '../services/ApiMap.json';

export class AxiosHelper {

    static responseObject = {
        object : null,
        error : null
    }
    static async getMethodCall(endpoint, type){
        let promise = new Promise((resolve, reject) => {
            axios.get(api.baseApi+endpoint)                          
            .then(response => {
                resolve(response);
            })
            .catch(error => {
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

        return (await promise);      
    }

    static async glaasGetMethodCall(endpoint, headers){
        let promise = new Promise((resolve, reject) => {
            axios.get(endpoint, headers)                          
            .then(response => {
                resolve(response);
            })
            .catch(error => {
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

        return (await promise);      
    }

    static async postMethodCall(endpoint, params, type){
        let promise = new Promise((resolve, reject) => {
            axios.post(api.baseApi+endpoint, params, { responseType: type })                          
            .then(response => {
                resolve(response); 
            })
            .catch(error => {
                if(error.response)
                {
                    if(error.response.data)
                        reject(error.response.data);
                    else
                        reject(error.response);
                }
                else
                    reject(error);
            })
        })
        return (await promise);
    }

}

export default AxiosHelper;
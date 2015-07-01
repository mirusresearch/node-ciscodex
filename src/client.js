'use strict';

import _ from 'lodash';
import request from 'request';
import xml2js from 'xml2js';


export default class Client {
    constructor(username, password, ip_or_host){
        this.username = username;
        this.password = password;
        this.ip_or_host = ip_or_host;
        this.endpoint = `http://${ip_or_host}/`;
    }

    callCodec(method, path, query={}, body={}){
        var self = this;
        return new Promise((resolve, reject) => {
            request[method]({
                url: self.endpoint + path,
                qs: query,
                body: _.isEmpty(body) ? undefined : (new xml2js.Builder()).buildObject(body),
                auth: {username: self.username, password: self.password},
                headers: {'content-type': 'text/xml'}
            }, (err, response, response_body) => {
                if (err){
                    reject(err);
                }
                // console.log("response:", response);
                console.log("response_body:", response_body);
                xml2js.parseString(
                    response_body,
                    {
                        tagNameProcessors: [xml2js.processors.normalize, xml2js.processors.stripPrefix],
                        attrNameProcessors: [xml2js.processors.normalize]
                    },
                    (err2, result) => {
                    if (err2){
                        reject(err2);
                    }
                    resolve(result);
                });
            });
        });
    }

    getStatus(location){
        return this.callCodec(
            'get',
            'getxml',
            {
                location: '/Status/' + location
            }
        ).then((data) => {
            return data.status[location.toLowerCase()];
        }).catch((err)=>{
            console.error(err);
        });
    }

    getCurrentCalls(){
        return this.getStatus('Call');
    }

    getCurrentCall(){
        return this.getCurrentCalls().then((calls)=>{
            return calls[0];
        });
    }

    getCallDuration(call){
        return parseInt(call.duration[0]['_']);
    }
}

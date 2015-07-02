'use strict';

import _ from 'lodash';
import request from 'request';
import {xmlParser, xmlBuilder} from './utils';


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
                body: _.isEmpty(body) ? undefined : xmlBuilder.buildObject(body),
                auth: {username: self.username, password: self.password},
                headers: {'content-type': 'text/xml'}
            }, (err, response, response_body) => {
                if (err){
                    reject(err);
                }
                // console.log("response:", response);
                console.log("response_body:", response_body);
                xmlParser.parseString(
                    response_body,
                    (err2, result) => {
                        if (err2){
                            reject(err2);
                        }
                        var empty = (_.keys(result).length === 1) && (_.has(result, '$'));
                        resolve(result, empty);
                    }
                );
            });
        });
    }

    sendCommand(command){
        return this.callCodec('post', 'putxml', {}, {Command: command});
    }

    getXML(location){
        return this.callCodec('get', 'getxml', {location: location});
    }

    getStatus(location){
        let req = this.getXML('/Status/' + location)
        req.then((status, empty) => {
            console.log(empty);
            return status[location.toLowerCase()];
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
        return parseInt(call.duration['_']);
    }

    registerFeedbackEndpoint(slot, url, expressions){
        var exprArray = [];
        _.each(expressions, function(x, i){
            exprArray.push({'$': {item: i}, '_': x});
        });
        this.sendCommand({
            HttpFeedback: {
                Register: {
                    '$': {command: "True"},
                    FeedbackSlot: slot,
                    ServerUrl: url,
                    Expression: exprArray
                }
            }
        });
    }
}

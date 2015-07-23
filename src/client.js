'use strict';

import _ from 'lodash';
import request from 'request';
import {xmlParser, xmlBuilder} from './utils';


export default class Client {
    constructor(username, password, ip_or_host, logdebug){
        this.username = username;
        this.password = password;
        this.ip_or_host = ip_or_host;
        this.endpoint = `http://${ip_or_host}/`;
        this.logdebug = logdebug || false;
    }

    debug(...args){
        // console.log('calling debug',args);
        if (this.logdebug){
          console.log.apply(null, args);
        }
    }

    callCodec(method, path, query={}, body={}){
        this.debug('callCodec', [].slice.apply(arguments));
        return new Promise((resolve, reject) => {
            request[method]({
                url: this.endpoint + path,
                qs: query,
                body: _.isEmpty(body) ? undefined : xmlBuilder.buildObject(body),
                auth: {username: this.username, password: this.password},
                headers: {'content-type': 'text/xml'}
            }, (err, response, response_body) => {
                if (err){
                    reject(err);
                }
                if (!response_body){
                    reject(new Error('No response'));
                }
                this.debug("response_body:", response_body);
                xmlParser.parseString(response_body,(err2, result) => {
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
        this.debug("sendCommand:", command);
        return this.callCodec('post', 'putxml', {}, {Command: command});
    }

    getXML(location){
        this.debug("getXML:", location);
        return this.callCodec('get', 'getxml', {location: location});
    }

    getStatus(location){
        this.debug("getStatus:", location);
        let req = this.getXML('/Status/' + location);
        req.then((status, empty) => {
            this.debug(empty);
            return status[location.toLowerCase()];
        }).catch((err)=>{
            console.error(err);
        });
    }

    getCurrentCalls(){
        this.debug("getCurrentCalls:");
        return this.getStatus('Call');
    }

    getCurrentCall(){
        this.debug("getCurrentCall:  starting");
        return this.getCurrentCalls().then((calls)=>{
            this.debug("getCurrentCall:", calls[0]);
            return calls[0];
        });
    }

    getCallDuration(call){
        this.debug("getCallDuration:", call);
        return parseInt(call.duration._);
    }

    reboot(){
        return this.sendCommand({Boot: {Action: "Restart"}});
    }

    registerFeedbackEndpoint(slot, url, expressions){
        this.debug("registerFeedbackEndpoint:", slot, url, expressions);
        var exprArray = [];
        _.each(expressions, function(x, i){
            exprArray.push({'$': {item: i}, '_': x});
        });
        return this.sendCommand({
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

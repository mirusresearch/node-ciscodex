'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _utils = require('./utils');

var Client = (function () {
    function Client(username, password, ip_or_host) {
        _classCallCheck(this, Client);

        this.username = username;
        this.password = password;
        this.ip_or_host = ip_or_host;
        this.endpoint = 'http://' + ip_or_host + '/';
    }

    _createClass(Client, [{
        key: 'callCodec',
        value: function callCodec(method, path) {
            var query = arguments[2] === undefined ? {} : arguments[2];
            var body = arguments[3] === undefined ? {} : arguments[3];

            var self = this;
            return new Promise(function (resolve, reject) {
                _request2['default'][method]({
                    url: self.endpoint + path,
                    qs: query,
                    body: _lodash2['default'].isEmpty(body) ? undefined : _utils.xmlBuilder.buildObject(body),
                    auth: { username: self.username, password: self.password },
                    headers: { 'content-type': 'text/xml' }
                }, function (err, response, response_body) {
                    if (err) {
                        reject(err);
                    }
                    // console.log("response:", response);
                    console.log('response_body:', response_body);
                    _utils.xmlParser.parseString(response_body, function (err2, result) {
                        if (err2) {
                            reject(err2);
                        }
                        var empty = _lodash2['default'].keys(result).length === 1 && _lodash2['default'].has(result, '$');
                        resolve(result, empty);
                    });
                });
            });
        }
    }, {
        key: 'sendCommand',
        value: function sendCommand(command) {
            return this.callCodec('post', 'putxml', {}, { Command: command });
        }
    }, {
        key: 'getXML',
        value: function getXML(location) {
            return this.callCodec('get', 'getxml', { location: location });
        }
    }, {
        key: 'getStatus',
        value: function getStatus(location) {
            var req = this.getXML('/Status/' + location);
            req.then(function (status, empty) {
                console.log(empty);
                return status[location.toLowerCase()];
            })['catch'](function (err) {
                console.error(err);
            });
        }
    }, {
        key: 'getCurrentCalls',
        value: function getCurrentCalls() {
            return this.getStatus('Call');
        }
    }, {
        key: 'getCurrentCall',
        value: function getCurrentCall() {
            return this.getCurrentCalls().then(function (calls) {
                return calls[0];
            });
        }
    }, {
        key: 'getCallDuration',
        value: function getCallDuration(call) {
            return parseInt(call.duration['_']);
        }
    }, {
        key: 'registerFeedbackEndpoint',
        value: function registerFeedbackEndpoint(slot, url, expressions) {
            var exprArray = [];
            _lodash2['default'].each(expressions, function (x, i) {
                exprArray.push({ '$': { item: i }, '_': x });
            });
            this.sendCommand({
                HttpFeedback: {
                    Register: {
                        '$': { command: 'True' },
                        FeedbackSlot: slot,
                        ServerUrl: url,
                        Expression: exprArray
                    }
                }
            });
        }
    }]);

    return Client;
})();

exports['default'] = Client;
module.exports = exports['default'];
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
    function Client(username, password, ip_or_host, logdebug) {
        _classCallCheck(this, Client);

        this.username = username;
        this.password = password;
        this.ip_or_host = ip_or_host;
        this.endpoint = 'http://' + ip_or_host + '/';
        this.logdebug = logdebug || false;
    }

    _createClass(Client, [{
        key: 'debug',
        value: function debug() {
            // console.log('calling debug',args);
            if (this.logdebug) {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                console.log.apply(null, args);
            }
        }
    }, {
        key: 'callCodec',
        value: function callCodec(method, path) {
            var _this = this;

            var query = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
            var body = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

            this.debug('callCodec', [].slice.apply(arguments));
            return new Promise(function (resolve, reject) {
                _request2['default'][method]({
                    url: _this.endpoint + path,
                    qs: query,
                    body: _lodash2['default'].isEmpty(body) ? undefined : _utils.xmlBuilder.buildObject(body),
                    auth: { username: _this.username, password: _this.password },
                    headers: { 'content-type': 'text/xml' }
                }, function (err, response, response_body) {
                    if (err) {
                        reject(err);
                    }
                    if (!response_body) {
                        reject(new Error('No response'));
                    }
                    _this.debug('response_body:', response_body);
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
            this.debug('sendCommand:', command);
            return this.callCodec('post', 'putxml', {}, { Command: command });
        }
    }, {
        key: 'getXML',
        value: function getXML(location) {
            this.debug('getXML:', location);
            return this.callCodec('get', 'getxml', { location: location });
        }
    }, {
        key: 'getStatus',
        value: function getStatus(location) {
            var _this2 = this;

            this.debug('getStatus:', location);
            var req = this.getXML('/Status/' + location);
            req.then(function (status, empty) {
                _this2.debug(empty);
                return status[location.toLowerCase()];
            })['catch'](function (err) {
                console.error(err);
            });
        }
    }, {
        key: 'getCurrentCalls',
        value: function getCurrentCalls() {
            this.debug('getCurrentCalls:');
            return this.getStatus('Call');
        }
    }, {
        key: 'getCurrentCall',
        value: function getCurrentCall() {
            this.debug('getCurrentCall:', call);
            return this.getCurrentCalls().then(function (calls) {
                return calls[0];
            });
        }
    }, {
        key: 'getCallDuration',
        value: function getCallDuration(call) {
            this.debug('getCallDuration:', call);
            return parseInt(call.duration['_']);
        }
    }, {
        key: 'registerFeedbackEndpoint',
        value: function registerFeedbackEndpoint(slot, url, expressions) {
            this.debug('registerFeedbackEndpoint:', slot, url, expressions);
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
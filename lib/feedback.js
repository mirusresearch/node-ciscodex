'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = getExpressFeedbackHandler;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _utils = require('./utils');

function getExpressFeedbackHandler(app, callback) {
    app.use(_bodyParser2['default'].raw());

    function handler(req, res) {
        console.log('request body', req.body);
        _utils.xmlParser.parseString(req.body, callback);
    }

    return handler;
}

module.exports = exports['default'];
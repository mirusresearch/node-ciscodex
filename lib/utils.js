'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

var _expressXmlBodyparser = require('express-xml-bodyparser');

var _expressXmlBodyparser2 = _interopRequireDefault(_expressXmlBodyparser);

var parserOpts = {
    explicitArray: false,
    explicitRoot: false,
    tagNameProcessors: [_xml2js2['default'].processors.normalize, _xml2js2['default'].processors.stripPrefix],
    attrNameProcessors: [_xml2js2['default'].processors.normalize]
};

var xmlParser = new _xml2js2['default'].Parser(parserOpts);
exports.xmlParser = xmlParser;
var xmlBodyParser = new _expressXmlBodyparser2['default'](parserOpts);
exports.xmlBodyParser = xmlBodyParser;
var xmlBuilder = new _xml2js2['default'].Builder();
exports.xmlBuilder = xmlBuilder;
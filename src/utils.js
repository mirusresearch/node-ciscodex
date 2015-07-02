import xml2js from 'xml2js';
import expressXmlParser from 'express-xml-bodyparser';

var parserOpts = {
    explicitArray: false,
    explicitRoot: false,
    tagNameProcessors: [xml2js.processors.normalize, xml2js.processors.stripPrefix],
    attrNameProcessors: [xml2js.processors.normalize],
};

export var xmlParser = new xml2js.Parser(parserOpts);
export var xmlBodyParser = new expressXmlParser(parserOpts);
export var xmlBuilder = new xml2js.Builder();

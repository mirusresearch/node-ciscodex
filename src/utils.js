import xml2js from 'xml2js';
import expressXmlParser from 'express-xml-bodyparser';

xml2js.processors.parseBooleans = xml2js.processors.parseBooleans || function(str) {
    if (/^(?:true|false)$/i.test(str)) {
        str = str.toLowerCase() === 'true';
    }
    return str;
};

var xmlParser = new xml2js.Parser({
    explicitArray: false,
    explicitRoot: false,
    ignoreAttrs:true,
    mergeAttrs:true,
    valueProcessors: [xml2js.processors.parseNumbers, xml2js.processors.parseBooleans],
    tagNameProcessors: [xml2js.processors.stripPrefix],
});

export var xmlParser = new xml2js.Parser(parserOpts);
export var xmlBodyParser = new expressXmlParser(parserOpts);
export var xmlBuilder = new xml2js.Builder();

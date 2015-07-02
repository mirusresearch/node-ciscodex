import bodyParser from 'body-parser';

import {xmlParser} from './utils';

export default function getExpressFeedbackHandler(app, callback){
    app.use(bodyParser.raw());

    function handler(req, res){
        console.log('request body', req.body);
        xmlParser.parseString(req.body, callback);
    }

    return handler;
}

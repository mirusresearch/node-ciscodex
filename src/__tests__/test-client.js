import {Client} from '../index';
var args = process.argv.slice(2);
console.log('args:', args);

var codec = new Client(args[0], args[1], args[2], true);
codec.registerFeedbackEndpoint(4, 'http://192.168.1.2:8002/post/', ['/Configuration']).then(function(result){
    console.log('registerFeedbackEndpoint result:', result);
}).catch(function(err){
    console.error('ERROR:', err);
});

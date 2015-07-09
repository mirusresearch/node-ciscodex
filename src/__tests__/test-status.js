// call script with 3 arguments:  username, password, host
import {Client} from '../index';
var args = process.argv.slice(2);
console.log('args:',args);

var codec = new Client(args[0],args[1],args[2],false);
codec.getXML('/Status/SystemUnit').then(function(status, empty){
    console.log('STATUS:',status);
}).catch(function(err){
    console.error('ERROR:',err);
});

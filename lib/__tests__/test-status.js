// call script with 3 arguments:  username, password, host
'use strict';

var _index = require('../index');

var args = process.argv.slice(2);
console.log('args:', args);

var codec = new _index.Client(args[0], args[1], args[2], false);
codec.getXML('/Status/SystemUnit').then(function (status, empty) {
    console.log('STATUS:', status);
})['catch'](function (err) {
    console.error('ERROR:', err);
});
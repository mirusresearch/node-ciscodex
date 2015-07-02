// jest.dontMock('../index');

'use strict';

var _index = require('../index');

// describe('client', function(){
//     it('can get the call status', function(){
//         var client = new Client(user, pass, host);
//         var status = client.getCallStatus();
//         expect(status.duration).toBe(10);
//     });
// });
var client = new _index.Client(user, pass, host);

// client.getCurrentCall().then((call)=>{
//     console.log(client.getCallDuration(call));
// });

client.registerFeedbackEndpoint(2, 'http://<your_ip>:8002/post/', ['/Configuration']);
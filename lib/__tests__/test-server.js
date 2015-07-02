'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var app = (0, _express2['default'])();
app.use(_index2['default'].utils.xmlBodyParser);

app.post('/post', function (req, res) {
  console.log('body:', req.body);
});

app.listen(8002);
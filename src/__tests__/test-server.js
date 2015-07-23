import express from 'express';
import ciscodex from '../index';

var app = express();
app.use(ciscodex.utils.xmlBodyParser);

app.post('/post', (req, res) =>{
  console.log("body:", req.body);
});

app.listen(8002);

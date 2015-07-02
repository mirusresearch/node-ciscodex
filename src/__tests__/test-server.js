import express from 'express';
import codex from '../index';

var app = express();
app.use(codex.utils.xmlBodyParser);

app.post('/post', (req, res) =>{
  console.log("body:", req.body);
})

app.listen(8002);

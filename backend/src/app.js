var express = require('express');
var app = express();
  
// Routes
  
app.get('/', function(req, res) {
    res.send('Hello World! Ini adalah Website Express.js pertama saya');
});
  
// Listen
  
var port = process.env.PORT || 4461;
app.listen(port);
console.log('Listening on localhost:'+ port);
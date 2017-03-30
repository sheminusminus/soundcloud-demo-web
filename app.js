var express = require('express')
var app = express()
var path = require('path');
var port = process.env.port || 3000;

app.use('/dist', express.static(__dirname + '/client/dist'));
app.use('/node_modules', express.static(__dirname + '/client/node_modules'));
app.use('/',express.static(__dirname + '/client/public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/client/public/index.html'));
})

app.get('/upload.html', function(req, res) {
  res.sendFile(path.join(__dirname + '/client/public/upload.html'));
})


// App listening on port 3000 for incoming requests.
app.listen(port, function () {
    console.log('App is Running');       
});

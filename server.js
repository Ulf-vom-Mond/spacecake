var express = require('express');
var app = express();
var path = require('path');

var keys = 0;

const { SerialPort } = require('serialport')

const serial = new SerialPort({
  path: '/dev/ttyUSB0',
  baudRate: 115200,
})

const port = 3000;

app.use(express.static(path.join(__dirname, './frontend')));

app.listen(port, function(){
   console.log('Listening on port ' + port)
})

app.get('/keys', function (req, res) {
    res.json({
      keys: keys
    })
});

serial.on('data', function (data) {
  keys = data[data.length - 1]
})

serial.on('error', function(err) {
  console.log('Error: ', err.message)
})

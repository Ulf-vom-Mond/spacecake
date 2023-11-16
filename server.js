var express = require('express');
var app = express();
var path = require('path');

var keys = 0;

var highscores = [];

const { SerialPort } = require('serialport');
var fs = require('fs');

const serial = new SerialPort({
  path: '/dev/ttyUSB0',
  baudRate: 115200,
})

const port = 3000;

app.use(express.static(path.join(__dirname, './frontend')));

app.listen(port, function(){
  console.log('Listening on port ' + port)
})

app.get('/buttons', function (req, res) {
  res.json({
    buttons: keys
  })
});

app.get('/highscores', function (req, res) {
  res.json({
    highscores: highscores
  })
});

app.post('/highscores', function (req, res) {
  var body = '';
  req.on('data', function (data) {
    body += data;
  });
  req.on('end', function () {
    var score = JSON.parse(body).highscores[0];
    highscores.push(score);
    highscores.sort((a, b) => b.score - a.score);
    fs.writeFile('highscores.json', JSON.stringify(highscores), err => {
      if (err) {
        console.error(err);
      }
    });
  });
});

serial.on('data', function (data) {
  keys = data[data.length - 1]
})

serial.on('error', function(err) {
  console.log('Error: ', err.message)
})

var fs = require('fs');

fs.readFile('highscores.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  highscores = JSON.parse(data);
});
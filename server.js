var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router(); // get an instance of the express Router


app.use('/api', router);
app.use(express.static('files'));
app.use(express.static('frontEnd'));


app.listen(port);
console.log('Magic happens on port ' + port);
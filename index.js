var api = require('./api');
var express = require('express');
var app = express();

var kantine = api.kantine();
var andreSiden = api.andre();


app.get('/', function(req, res){
	Promise.all([kantine, andreSiden])
	.then(values => {
		console.log(values);
  		res.send(values);
	});
});

app.listen(process.env.PORT || 3000);

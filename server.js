// imports
var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;

// instantiate server
var server = express();

// body parser configuration
server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

// confiigure routes
server.get('/', function(req, res){
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>hello world</h1>');
});

server.use("/api/", apiRouter);

// launch server
server.listen(8888, function(){
    console.log("dokh na");
});
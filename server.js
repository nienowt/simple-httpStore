'use strict';

var http = require('http');
var fs = require('fs');
var Router = require('./routes.js');
var treesRouter = new Router();


treesRouter.get('/trees', (req, res) => {
  console.log('/trees get route hit');
  res.writeHead(200, {'content-type':'text/html'});

  fs.readdir('./data', (err, files) =>{
    files.forEach((file) => {
      fs.readFile('./data/'+file, (err, data) => {
        res.write(JSON.parse(data.toString()));
        res.end();
      })
    })
  })
});

treesRouter.post('/trees', (req, res) => {
  console.log('/trees post route hit');
  res.writeHead(200, {'content-type':'text/html'});
  req.on('data', (data) => {
    var tree = data.toString();

    fs.readdir('./data',(err, files) => {
       var number = files.length;
       fs.writeFile('./data/trees-' + number + '.json', tree, () =>{
         console.log('File saved');
       });
     });
    req.on('end', () =>{
        return res.end();
    });
  });
});

http.createServer(treesRouter.route()).listen(3000, () => {
  console.log('LIVE 3000');
});

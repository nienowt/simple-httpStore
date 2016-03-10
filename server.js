'use strict';

var http = require('http');
var fs = require('fs');
var Router = require('./routes.js');
var treesRouter = new Router();


treesRouter.get('/trees', (req, res) => {
  console.log('/trees get route hit');
  res.writeHead(200, {'content-type':'text/html'});

  fs.readdir('./data', (err, files) =>{
    var count = 0;
    var treeList = '';
    files.forEach((file) => {
      fs.readFile('./data/'+ file, (err, data) => {
        count++;
        treeList += JSON.parse(data.toString()).type + ' ';
        if(count === files.length){
          res.write( treeList);
          return res.end();
        }
      });
    });
  });
});


treesRouter.post('/trees', (req, res) => {
  console.log('/trees post route hit');
  res.writeHead(200, {'content-type':'text/html'});
  req.on('data', (data) => {
    var tree = data.toString();

    fs.mkdir(__dirname + '/data', () => {
      fs.readdir('./data',(err, files) => {
        fs.writeFile('./data/trees-' + files.length + '.json', tree, () =>{
          console.log('File saved');
        });
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

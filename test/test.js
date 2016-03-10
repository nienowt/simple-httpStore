'use strict';

var chai = require('chai');
var chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
var request = chai.request;
var expect = chai.expect;
var fs = require('fs');
require(__dirname + '/../server.js');



describe('http server', () => {
  it('should respond to /trees post by storing body in json file', (done) => {
    request('localhost:3000')
    .post('/trees')
    .send('{"type":"Spruce"}')
    .end((err, res) => {
      fs.readdir('./data', (err, files) =>{
        var oap = files.length -1;
        fs.readFile('./data/'+ files[oap], (err, data) => {
          var jsonContent = JSON.parse(data.toString()).type;
          expect(err).to.eql(null);
          expect(res).to.have.status(200);
          expect(res).to.have.header('content-type','text/html');
          expect(jsonContent).to.eql('Spruce');
          done();
        });
      });
    });
  });

  it('should respond to /trees get requests with the contents of the stored files', (done) => {
    request('localhost:3000')
    .get('/trees')
    .end((err, res) => {
      fs.readdir('./data', (err, files) =>{
        var count = 0;
        var treeList = '';
        files.forEach((file) => {
          fs.readFile('./data/'+ file, (err, data) => {
            count++;
            treeList += JSON.parse(data.toString()).type + ' ';
            if(count === files.length){
              expect(err).to.eql(null);
              expect(res).to.have.status(200);
              expect(res).to.have.header('content-type','text/html');
              expect(res.text).to.eql(treeList);
              done();
            }
          });
        });
      });
    });
  });
});

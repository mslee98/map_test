// 네이버 검색 API 예제 - 블로그 검색
var express = require('express');

require('dotenv').config();

var cors = require('cors')
var app = express();

app.use(cors());

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;

app.get('/search/region', (req, res) => {

    var api_url = 'https://openapi.naver.com/v1/search/local?query=' + encodeURI(req.query.query) + '&display=5'; // JSON 결과
    
    var request = require('request');
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret},
    };

    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
          res.end(body);
        } else {
          res.status(response.statusCode).end();
          console.log('error = ' + response.statusCode);
        }
      });
})


 app.listen(3000, function () {
   console.log('app listening on port 3000!');
 });
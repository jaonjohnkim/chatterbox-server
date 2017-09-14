// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var objectId = 0;
var messages = {
  results: [
    {
      roomname: 'lobby',
      username: 'Jono',
      text: 'Do my bidding!',
      objectId: '0'
    }
  ]
};

var path = require('path');
var Url = require('url');

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var header = request.headers;
  var method = request.method;
  var url = request.url;

  console.log(url)
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  if (method === 'GET' && url === '/classes/messages' || method === 'OPTIONS') {
    
    var statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(messages));

  } else if (method === 'POST' && url === '/classes/messages') {
    var data = {};

    request.addListener('data', (chunk) => {
      var chunks = chunk.toString().split('&');
      //console.log(chunks);
      for (var i = 0; i < chunks.length; i++) {
        var words = chunks[i].split('=');
        //console.log('words:',words);
        // prop vals in data obj
        console.log(words[1]);
        data[words[0]] = decodeURIComponent(words[1].replace(/\+/g, ' '));
      }
      objectId += 1;
      data.objectId = objectId.toString();
      messages.results.push(data);
      // console.log(data);
      // console.log(chunk.toString());
      // console.log(messages.results);
      
    });
    var statusCode = 201;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  } else {
    var statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end('NOT FOUND');
  }
};

exports.requestHandler = requestHandler;



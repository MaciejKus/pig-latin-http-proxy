/* a pig latin http proxy
 * usage: http://localhost:3002/?url=http://www.nytimes.com
 * will show the nytimes.com website with most of the text
 * translated to pig latin
 */

var http = require('http');
var url = require('url');
var request = require('request');
var piglatin = require('piglatin');
var replaceStream = require('replacestream');

http.createServer(onRequest).listen(3002);

//two arguments
//argument[1] is string to be translated into pig latin
//argument two is the type of tag the string is inside of (<p>, <br>, etc)
function replacePig() {
  return  piglatin(arguments[1]) + '<' + arguments[2] + '>';
}

function onRequest(req, res) {

    //url must begin with http://
    var queryData = url.parse(req.url, true).query;
    if (queryData.url) {
        console.log('looking for ' + queryData.url)
        request(
            queryData.url, function( error){
              if(error) {
                console.log(error);
                res.end('bad url, make sure you have http:// before the url');
              }
            })
        //find a string with all characters other than a >
        //and that ends in </p> or </br> etc.
        .pipe(replaceStream(/([^\>]*)\<(\/p|\/a|\/br|\/h1|\/h2)\>/g, replacePig))
        .pipe(res);
    }
    else {
        res.end("no url found");
    }
}

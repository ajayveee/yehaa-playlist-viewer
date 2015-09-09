var express = require('express'),
    path = require('path'),
    http = require('https');
 
//create our express app
var app = express();
var playlists = ['Elton John', 'Madonna', 'Beatles', 'Stevie Wonder', 'Frank Sinatra', 'Louis Armstrong'];
var apiKey = 'AIzaSyCYTcIF_zoOf0NHIX0W1j9AkclMBrGnDTg';

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
//add some standard express middleware
app.configure(function() {
    app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.static('public'));
});
 
//routes
app.get('/', function(req, resp) {
	http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + encodeURIComponent(playlists[0]) +'&key=' + apiKey , function(res){
        var str = '';
        //console.log('STATUS : '+res.statusCode);
       // console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.on('data', function (chunk) {
              //console.log('BODY: ' + chunk);
               str += chunk;
         });

        res.on('end', function () {
        	//console.log(str);
        	x = JSON.parse(str);
        	//console.log(x);
            resp.render('gapi', {data : x, playlists : playlists, apiKey: apiKey});
        });

 	});
	//res.render('gapi', test);
});
 
//have our app listen on port 3000
app.listen(3000);
console.log('Your app is now running at: http://127.0.0.1:3000/');
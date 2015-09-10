var express = require('express'),
    path = require('path'),
    http = require('https');
 
//create our express app
var app = express();
var playlists = ['Elton John', 'Madonna', 'Beatles', 'Stevie Wonder', 'Frank Sinatra', 'Louis Armstrong'];
var apiKey = 'AIzaSyCYTcIF_zoOf0NHIX0W1j9AkclMBrGnDTg';
var apiUrl = 'https://www.googleapis.com/youtube/v3/search';
var defaultParams = ['part=snippet','type=playlist', 'maxResults=10', 'key=' + apiKey];


app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.logger('dev')); 

// Variables that can be utilized in jade template 
var helper = {
  // helper function that can be utilised in jade for formatting number with commas
  numberWithCommas: function (x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  },
  ytPlaylistURLPrefix: 'https://www.youtube.com/playlist?list='
}
//routes
app.get('/', function(req, resp) {
	fetchPlaylists('main', encodeURIComponent(playlists[0]), resp);
	//res.render('gapi', test);
});

// helper funtion that makes the get request to youtube api and returns html as response
function fetchPlaylists(renderTarget, plName, resp, paramString){
  if(typeof paramString == "undefined"){
    paramString = "";
  }
  http.get(apiUrl + '?'+ defaultParams.join('&') + '&q=' + plName + paramString, function(res){
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
            resp.render(renderTarget, {data : x, playlists : playlists, apiKey: apiKey, helper: helper});
        });

  });
}

// route to fetch html of playlist from client
app.get ('/fpl' , function(req, resp){
  fetchPlaylists('playlist', encodeURIComponent(req.query.p), resp);
});

// route to support pagination
app.get('/np', function(req, resp){
  fetchPlaylists('listItems', encodeURIComponent(req.query.p), resp, '&pageToken=' + encodeURIComponent(req.query.pageToken));
});

//have our app listen on port 3000
app.listen(3000);
console.log('Your app is now running at: http://127.0.0.1:3000/');
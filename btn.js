"use strict";
var request = require('request');
var config = require('./config.js');
var nano = require('nano')(config.couchUrl);

var url = "http://api.btnapps.net/";
var getTorrents = {
	method: "getTorrentsSearch",
	params: [
		config.apikey,
		{
			   "Category": "Episode"
		},
		1000
	],
	id: 1
};

nano.auth(config.couchUsername, config.couchPassword, function (err, body, headers) {
  if(err) {
    console.log(err);
  }
  else {
    nano = require('nano')({
      url: config.couchUrl,
      cookie: headers['set-cookie']
    });
		makeRequest();
  }
});

function makeRequest() {
	var torrentsDB = nano.use('torrents');
	request({
	    url: url,
	    method: "POST",
	    json: getTorrents
	}, function (error, response, body) {
	  if (!error && response.statusCode == 200 && body.result) {
	  	var today = Date.now();
			Object.keys(body.result.torrents).forEach(function(t) {
				var time = parseInt(body.result.torrents[t].Time);
	    	if(time < (today/1000) - 24 * 60 * 60 && time > (today/1000) - 25 * 60 * 60) {
					var torrent = body.result.torrents[t];
					console.log(torrent.ReleaseName);
					torrentsDB.insert(torrent, torrent.ReleaseName, null);
				}
	    });
	  }
	});
}

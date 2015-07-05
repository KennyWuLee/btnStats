"use strict";
var request = require('request');
var nano = require('nano')('http://localhost:5984');
var torrentsDB = nano.use('torrents');

var apikey = "";
var url = "http://api.btnapps.net/";
var getTorrents = {
	method: "getTorrentsSearch",
	params: [
		apikey,
		{
			   "Category": "Episode"
		},
		1000
	],
	id: 1
};

request({
    url: url,
    method: "POST",
    json: getTorrents
}, function (error, response, body) {
  if (!error && response.statusCode == 200 && body.result.torrents) {
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

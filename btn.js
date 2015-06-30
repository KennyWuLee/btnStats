"use strict";
var request = require('request');
var apikey = "";

var url = "http://api.btnapps.net/";

var userInfo = {
	method: "userInfo",
	params: [apikey],
	id: 1
};
var getTorrentsSearch = {
	method: "getTorrentsSearch",
	params: [
		apikey,
		{
			series: "Hannibal",
			name: "S03E01"
		},

	],
	id: 1
};
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
  if (!error && response.statusCode == 200) {
  	var i = 0;
  	var today = Date.now();
    for(var t in body.result.torrents) {
    	var time = parseInt(body.result.torrents[t].Time);
    	if(time < (today/1000) - 24 * 60 * 60 && time > (today/1000) - 26 * 60 * 60) {
			console.log(body.result.torrents[t].ReleaseName);
			var d = new Date(body.result.torrents[t].Time * 1000);
    		console.log(d.toDateString() + "     " + d.toTimeString());
    	}
    	i++;
    }
    console.log(i);
  }
});
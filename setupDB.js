var config = require('./config.js');
var nano = require('nano')(config.couchUrl);

var views = {
  all: {
    map: function(doc) {
      emit();
    }.toString()
  },
  byTime: {
    map: function(doc) {
      emit(doc.Time);
    }.toString()
  }
}

nano.auth(config.couchUsername, config.couchPassword, function (err, body, headers) {
  if(err) {
    console.log(err);
  }
  else {
    nano = require('nano')({
      url: config.couchUrl,
      cookie: headers['set-cookie']
    });
    checkDatabase();
  }
});

function checkDatabase() {
  nano.db.get('torrents', function(err, body) {
    if(err) {
      if(err.statusCode === 404) {
        nano.db.create('torrents', function(err, body) {
          if (err)
            console.log(err);
          else
            updateDesign();
        });
      }
      else {
        console.log(err);
      }
    }
    else {
      updateDesign();
    }
  });
}

function updateDesign() {
  var torrentsDB = nano.use('torrents');
  torrentsDB.get('_design/torrents', {}, function(err, body) {
    if (!err || err.statusCode === 404) {
      body = body || { views: {}};
      Object.keys(views).forEach(function(name) {
        body.views[name] = views[name];
      });
      torrentsDB.insert(body, '_design/torrents', function(err, body) {
        if (err)
          console.log(err);
      });
    }
    else {
      console.log(err);
    }
  });
}

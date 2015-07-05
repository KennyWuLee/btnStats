var nano = require('nano')('http://localhost:5984');

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

nano.db.get('torrents', function(err, body) {
  if(!err || err.statusCode === 404) {
    if(err && err.statusCode === 404)
      nano.db.create('torrents');
    updateDesign();
  }
});

function updateDesign() {
  var torrentsDB = nano.use('torrents');
  torrentsDB.get('_design/torrents', {}, function(err, body) {
    if (!err || err.statusCode === 404) {
      body = body || { views: {}};
      Object.keys(views).forEach(function(name) {
        body.views[name] = views[name];
      });
      torrentsDB.insert(body, '_design/torrents', null);
    }
  });
}

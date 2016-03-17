var jsonp = require('jsonp'),
    url = require('url');

function request(opts, cb) {
  var parts = url.parse(opts.url);
  parts.query = opts.qs;
  jsonp(url.format(parts), function(err, data) {
    if (err) return cb(err);
    cb(null, {}, data);
  });
};

module.exports = request;
module.exports.defaults = function() {};

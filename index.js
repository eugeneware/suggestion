var request = require('request').defaults({ jar: true }),
    after = require('after');

module.exports = suggest;

var urlBase = 'http://clients1.google.com/complete/search?client=heirloom-hp&hl=en&gs_rn=0&gs_ri=heirloom-hp&cp=7&'
var resRegex = /^window\.google\.ac\.h\((.*)\)$/;
var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36';
var reqId = 0;

function suggest(keyword, opts, cb) {
  if (typeof cb === 'undefined' && typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  opts.levels = opts.levels || 0;
  if (opts.levels === 0) {
    doSuggest(keyword, cb);
  } else if (opts.levels === 1) {
    var nA = 'a'.charCodeAt(0);
    var next = after(26, done);
    var results = [];

    for (var i = 0; i < 26; i++) {
      c = String.fromCharCode(nA + i);
      doSuggest(keyword + ' ' + c, function (err, suggestions) {
        if (err) return next(err);
        results = results.concat(suggestions);
        next();
      });
    }
    function done () {
      cb(null, results);
    }
  } else {
    doSuggest(keyword, cb);
  }
}

function doSuggest(keyword, cb) {
  request({
    url: urlBase + 'gs_id=' + (reqId++) + '&q=' + encodeURIComponent(keyword),
    headers: { 'User-Agent': userAgent }
  }, function (err, res, body) {
    if (err) return cb(err);
    var m = resRegex.exec(body);
    if (m) {
      try {
        var o = JSON.parse(m[1]);
        if (Array.isArray(o) && o.length) {
          var suggestions = o[1].map(function (item) {
            return stripTags(item[0]);
          });
          return cb(null, suggestions);
        }
      } catch (err) {
        return cb(err);
      }
    }
    cb(null, []);
  });
}

var stripTagsRegex = /\<\/?[^\>]+\>/g;
function stripTags(s) {
  return s.replace(stripTagsRegex, '');
}

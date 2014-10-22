var request = require('request');
module.exports = suggest;

var urlBase = 'http://clients1.google.com/complete/search?client=heirloom-hp&hl=en&gs_rn=0&gs_ri=heirloom-hp&cp=7&gs_id=0&q='
var resRegex = /^window\.google\.ac\.h\((.*)\)$/;
var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36';

function suggest(keyword, cb) {
  request({
    url: urlBase + encodeURIComponent(keyword),
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

var isBrowser = typeof window !== 'undefined',
    request = isBrowser ? require('./request') : require('request').defaults({ jar: true }),
    he = require('he'),
    after = require('after');

module.exports = suggest;

var urlBase = 'https://clients1.google.com/complete/search'
var resRegex = /^window\.google\.ac\.h\((.*)\)$/;
var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36';
var reqId = 0;

function suggest(keyword, opts, cb) {
  if (typeof cb === 'undefined' && typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  if (typeof opts.client === 'undefined') {
    opts.client = 'heirloom-hp';
  }

  if (typeof opts.hl === 'undefined') {
    opts.hl = 'en';
  }

  if (typeof opts.cp === 'undefined') {
    opts.cp = keyword.length;
  }

  opts.levels = opts.levels || 0;
  if (opts.levels === 0) {
    doSuggest(keyword, opts, cb);
  } else if (opts.levels === 1) {
    var nA = 'a'.charCodeAt(0);
    var next = after(26, done);
    var results = [];

    for (var i = 0; i < 26; i++) {
      c = String.fromCharCode(nA + i);
      doSuggest(keyword + ' ' + c, opts, function (err, suggestions) {
        if (err) return next(err);
        results = results.concat(suggestions);
        next();
      });
    }
    function done () {
      cb(null, results);
    }
  } else {
    doSuggest(keyword, opts, cb);
  }
}

function doSuggest(keyword, opts, cb) {
  var qs = {
    client: opts.client,
    hl: opts.hl,
    gs_rn: 0,
    gs_ri: opts.client,
    cp: opts.cp,
    gs_id: (reqId++),
    q: keyword
  };

  if (opts.client === 'youtube') {
    qs.ds = 'yt'
  }
  request({
    url: urlBase,
    qs: qs,
    headers: { 'User-Agent': userAgent }
  }, function (err, res, body) {
    if (err) return cb(err);
    if (typeof body === 'string') {
      var m = resRegex.exec(body);
      try {
        body = m ? JSON.parse(m[1]) : [];
      } catch (err) {
        return cb(err);
      }
    }

    if (Array.isArray(body) && body.length) {
      var suggestions = body[1].map(function (item) {
        return he.decode(stripTags(item[0]));
      });
      return cb(null, suggestions);
    }

    cb(null, []);
  });
}

var stripTagsRegex = /\<\/?[^\>]+\>/g;
function stripTags(s) {
  return s.replace(stripTagsRegex, '');
}

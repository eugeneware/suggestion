var it = require('tape'),
    suggest = require('..');

it('should be able to suggest a youtube keyword', function(t) {
  suggest('dog training', { client: 'youtube' }, function (err, suggestions) {
    t.plan(2);
    if (err) throw err;
    t.equals(suggestions.length, 10);
    t.assert(suggestions.some(function (suggestion) {
      return ~suggestion.indexOf('dog training');
    }));
  })
});

it('should be able to traverse a youtube level', function(t) {
  suggest('dog training', { client: 'youtube', levels: 1 }, function (err, suggestions) {
    if (err) throw err;
    t.assert(suggestions.length, 260);
    t.assert(suggestions.some(function (suggestion) {
      return ~suggestion.indexOf('dog training');
    }));
    t.end();
  });
});

it('should be able to suggest in other languages', function(t) {
  suggest('包', { client: 'youtube', hl: 'zh-CN'}, function (err, suggestions) {
    t.plan(2);
    if (err) throw err;
    t.equals(suggestions.length, 10);
    t.assert(suggestions.some(function (suggestion) {
      return ~suggestion.indexOf('包');
    }));
  })
});

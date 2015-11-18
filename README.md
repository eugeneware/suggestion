# suggestion

Queries google's suggestions API

[![build status](https://secure.travis-ci.org/eugeneware/suggestion.png)](http://travis-ci.org/eugeneware/suggestion)

## Installation

This module is installed via npm:

``` bash
$ npm install suggestion
```

## Example Usage

### Hit up google suggest with a single query

``` js
var suggest = require('suggestion');
suggest('dog training', function (err, suggestions) {
  if (err) throw err;
  console.log(suggestions);
  /*
  [ 'dog training',
    'dog training tips',
    'dog training collars',
    'dog training classes',
    'dog training videos',
    'dog training houston',
    'dog training certification',
    'dog training books',
    'dog training chicago',
    'dog training clicker' ]
  */
})
```

### Iterate through another level of google suggest

You can get even more suggestions by appending ' a', ' b', ' c' to your
google suggest query. This does it down to one level from `a` to `z`.

*NB: currently only one level of traversal is supported. Pull requests welcome.*

``` js
var suggest = require('suggestion');
suggest('dog training', { levels: 1 }, function (err, suggestions) {
  if (err) throw err;
  console.log(suggestions);
  /*
  [ 'dog training atlanta',
    'dog training austin',
    'dog training app',
    'dog training albuquerque',
    'dog training at home',
    'dog training albany ny',
    'dog training aids',
    'dog training and boarding',
    'dog training ann arbor',
    'dog training academy',
    'dog training books',
    .... (260 total results) ...
    'dog training zapper',
    'dog training zone',
    'dog training zoom room',
    'dog training zimmerman mn',
    'dog training zachary la',
    'dog training zak',
    'dog training zionsville',
    'dog training zebulon nc',
    'dog training zionsville indiana' ]
  */
});
```

### Youtube Suggest

Pass in "youtube" as the `client` option:

``` js
var suggest = require('suggestion');
suggest('dog training', { client: 'youtube' }, function (err, suggestions) {
  if (err) throw err;
  console.log(suggestions);
  /*
  [ 'dog training',
    'dog training collars',
    'dog training tips',
    'dog training near me',
    'dog training classes',
    'dog training videos',
    'dog training books',
    'dog training schools',
    'dog training clicker',
    'dog training houston' ]*/
});
```

### Change language

Pass in the language code as the `hl` option:

``` js
var suggest = require('suggestion');
suggest('包', { hl: 'zh-CN' }, function (err, suggestions) {
  if (err) throw err;
  console.log(suggestions);
  /*
  [ '包贝尔', '包子', '包子馅',
    '包青天', '包菜', '包包', '包', '包容',
    '包法利夫人', '包租婆' ]
  */
});
```

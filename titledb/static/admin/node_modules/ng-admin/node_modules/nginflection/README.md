# ngInflection

Angular filters for [inflection](https://github.com/dreamerslab/node.inflection). You can combine the filters to get some pretty cool results with English-language words.

You can see it in action, [here](http://konsumer.github.io/ngInflection/).

[![npm](https://nodei.co/npm/nginflection.png)](https://www.npmjs.com/package/nginflection)
[![Build Status](https://travis-ci.org/konsumer/ngInflection.svg)](https://travis-ci.org/konsumer/ngInflection)
[![Code Climate](https://codeclimate.com/github/konsumer/ngInflection/badges/gpa.svg?v=1.1.6)](https://codeclimate.com/github/konsumer/ngInflection)

## installation

You can use this library with requirejs, browserify, bower, or plain browser-globals.

### browserify

`npm install --save nginflection`

In your app-code:

```javascript
var angular = require('angular');
var inflection = require('inflection');
require('nginflection');
```


### bower

`bower install --save ngInflection`

### browser-globals

Here is how to use it with CDNs & no module-management:

```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.19/angular.min.js"></script>
<script src="https://cdn.rawgit.com/dreamerslab/node.inflection/master/inflection.min.js"></script>
<script src="http://konsumer.github.io/ngInflection/dist/ngInflection.min.js"></script>
```

### requirejs

Download into your requirejs path, then do this:

```javascript
define(['angular', 'inflection', 'ngInflection'], function(angular, inflection){
	// do stuff here
});
```

## usage

Once you have the code loaded, add it to your app, along with your other Angular dependencies:

```javascript
var app = angular.module('app', [
    'ngRoute',
    'ngInflection'
]);
```

Use it in your templates, like this:

```html
{{ myThing | pluralize | titleize }}
```

You can see more examples in [index.html](https://github.com/konsumer/ngInflection/blob/gh-pages/index.html).

### ngPluralize

[ngPluralize](https://docs.angularjs.org/api/ng/directive/ngPluralize) is useful for outputting numeric amounts of things.  If the name of the thing is unknown, and could be plural or singular, and the amount is unknown, you can use ngInflection with ngPluralize to work out the permutations of the string.  Here is a cool example:

```html
<ng-pluralize count="fruitCount"  when="{
	'0': 'No {{fruitType | pluralize | titleize}}',
	'1': 'One {{fruitType | singularize | titleize}}',
	'other': '{} {{fruitType | pluralize | titleize}}'}"></ng-pluralize>
```

*  If fruitCount=0 & fruitType='apple', you get 'No Apples'
*  If fruitCount=1 & fruitType='apple', you get 'One Apple'
*  If fruitCount=2 & fruitType='apple', you get '2 Apples'
*  If fruitCount=200 & fruitType='oranges', you get '200 Oranges'
*  If fruitCount=1 & fruitType='oranges', you get 'One Orange'
*  If fruitCount=1 & fruitType='Beautiful pears', you get 'One Beautiful Pear'
*  If fruitCount=10 & fruitType='beautiful pear', you get '10 Beautiful Pears'

### api

Here are all the filters available:


#### [pluralize](https://github.com/dreamerslab/node.inflection#inflectionpluralize-str-plural-)

Output a plural of a string. Use it like this:

```html
{{ 'person' | pluralize }} outputs people.
```

Sometimes, you might want to use a special word when a singular is detected:

```html
{{ 'person' | pluralize:'best buds' }} outputs best buds.
```


#### [singularize](https://github.com/dreamerslab/node.inflection#inflectionsingularize-str-singular-)

Output a singlular of a string. Use it like this:

```html
{{ 'people' | singularize }} outputs person.
```

Sometimes, you might want to use a special word when a plural is detected:

```html
{{ 'people' | singularize:'best bud' }} outputs best bud.
```

#### [inflect](https://github.com/dreamerslab/node.inflection#inflectioninflect-str-count-singular-plural-)

Output a singular or plural of a string based on a number. Use it like this:

```html
{{ 'person' | inflect:0 }} outputs people.
```

```html
{{ 'people' | inflect:1 }} outputs person.
```

```html
{{ 'person' | inflect:2 }} outputs people.
```

You can also pass in special words for both singular and plural:

```html
{{ 'people' | inflect:1:'best bud':'bestest buds' }} outputs best bud.
```

```html
{{ 'people' | inflect:2:'best bud':'bestest buds' }} outputs bestest buds.
```

#### [camelize](https://github.com/dreamerslab/node.inflection#inflectioncamelize-str-lowfirstletter-)

Output a camelize of a string. Use it like this:

```html
{{ 'Some cool stuff' | camelize }} outputs SomeCoolStuff.
```

You can also get the first letter lower-case, like this:

```html
{{ 'Some cool stuff' | camelize:true }} outputs someCoolStuff.
```


#### [underscore](https://github.com/dreamerslab/node.inflection#inflectionunderscore-str-alluppercase-)

Output an underscored version of a string. Use it like this:

```html
{{ 'SomeCoolStuff' | underscore }} outputs some_cool_stuff.
```


#### [humanize](https://github.com/dreamerslab/node.inflection#inflectionhumanize-str-lowfirstletter-)

Output a humanized version of a string. Use it like this:

```html
{{ 'some_cool_stuff' | humanize }} outputs Some cool stuff.
```

You might also want it not capitalized:

```html
{{ 'some_cool_stuff' | humanize:true }} outputs some cool stuff.
```


#### [capitalize](https://github.com/dreamerslab/node.inflection#inflectioncapitalize-str-)

Output a first-letter-capitalized version of a string. Use it like this:

```html
{{ 'some_cool_stuff' | capitalize }} outputs Some_cool_stuff.
```


#### [dasherize](https://github.com/dreamerslab/node.inflection#inflectiondasherize-str-)

Output a dasherized version of a string. Use it like this:

```html
{{ 'some_cool_stuff' | dasherize }} outputs some-cool-stuff.
```


#### [titleize](https://github.com/dreamerslab/node.inflection#inflectiontitleize-str-)

Output a titleized version of a string. Use it like this:

```html
{{ 'some_cool_stuff' | titleize }} outputs Some Cool Stuff.
```

#### [demodulize](https://github.com/dreamerslab/node.inflection#inflectiondemodulize-str-)

Output a demodulized version of a string. Use it like this:

```html
{{ 'Cool::Stuff' | demodulize }} outputs Stuff.
```

#### [tableize](https://github.com/dreamerslab/node.inflection#inflectiontableize-str-)

Output a tableized version of a string. Use it like this:

```html
{{ 'CoolThing' | tableize }} outputs cool_things.
```

#### [classify](https://github.com/dreamerslab/node.inflection#inflectionclassify-str-)

Output a classy version of a string. Use it like this:

```html
{{ 'cool_things' | classify }} outputs CoolThing.
```

#### [foreign_key](https://github.com/dreamerslab/node.inflection#inflectionforeign_key-str-dropidubar-)

Output a foreign_key version of a string. Use it like this:

```html
{{ 'cool_thing' | foreign_key }} outputs cool_thing_id.
```

You might want to join id to the string. Do that like this:

```html
{{ 'cool_thing' | foreign_key:true }} outputs cool_thingid.
```


#### [ordinalize](https://github.com/dreamerslab/node.inflection#inflectionordinalize-str-)

Output an ordinalized version of a string. Use it like this:

```html
{{ 'the 1 pitch' | ordinalize }} outputs the 1st pitch.
```

### possibly less-useful, but also included

I didn't include usage notes on these, because I couldn't think of good use-cases, but check out the original documentation, if these seem like something you want.


#### [indexOf](https://github.com/dreamerslab/node.inflection#inflectionindexof-arr-item-fromindex-comparefunc-)

This lets us detect if an Array contains a given element. This did not seem super-useful in the context of an angular string filter, but you could probably use it in some clever way with an array of objects.


#### [transform](https://github.com/dreamerslab/node.inflection#inflectiontransform-str-arr-)

This will execute an array of transforms. Since you can pipe filters in angular templates, this is best used from the filter service, not in actual templates. It works like this:

```javascript
filter('manipulateThingFromApi', function($filter) {
  return function(apiThing) {
    //manipulate api things
    return $filter('transform')(apiThing, ['pluralize', 'titleize']);
  }
}
```
To do the same things in a template, use Angular's pipe syntax, like so:

```html
{{ 'cool thing' | pluralize | titleize }} outputs Cool Things
```


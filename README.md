Angular Equalizer
=================

Equalize the height of a set of random elements, without necessarily having a common parent.

### Usage

Add it to your dependencies

```js
angular.module('yourapp', ['ngEqualizer']);
```

Use it in your elements/directives

```html
<div equalizer="group"></div>
<div equalizer="group" ng-repeat="item in items"></div>
<div equalizer="group" ng-if="current"></div>
```

### Dependencies

Needs jQuery and Lodash/Underscore

### License 

MIT

Angular Equalizer
=================

Equalize the height of a set of random elements, without necessarily having a common parent, container, etc. 

You can add and remove items on demand using the `EqualizeState` service. 

### Usage

Add it to your dependencies

```js
angular.module('yourapp', ['ngEqualizer']);

angular.directive('yourDirective', ['EqualizeState', function(EqualizeState){
  return {
    link: function(scope, el, attr){
      EqualizeState.add('yourDirective', el);
      EqualizeState.add('yourDirective', angular.element('<div/>'));
    }
  };
}]);
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

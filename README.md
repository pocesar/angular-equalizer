Angular Equalizer
=================

Equalize the height of a set of random elements, without necessarily having a common parent, container, etc. 

You can add and remove items on demand using the `EqualizeState` service. 

### Usage

Add it to your dependencies

```js
angular.module('yourapp', ['ngEqualizer']);
```

Use it in your directive

```js
angular.module('yourapp').directive('yourDirective', ['EqualizeState', function(EqualizeState){
  return {
    link: function(scope, el, attr){
      EqualizeState.add('yourDirective', el);
      EqualizeState.add('yourDirective', angular.element('<div/>'));
    }
  };
}]);
```

Or use it directly in your elements

```html
<div equalizer="group"></div>
<div equalizer="group" ng-repeat="item in items"></div>
<div equalizer="group" ng-if="current"></div>
```

### Dependencies

Needs jQuery and Lodash/Underscore (for the debounce function)

### License 

MIT

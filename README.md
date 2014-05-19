Angular Equalizer
=================

Equalize the height of a set of random elements, without necessarily having a common parent, container, etc. 

You can add and remove items on demand using the `EqualizerState` service. 

### Usage

Add it to your dependencies

```js
angular.module('yourapp', ['ngEqualizer']);
```

Use it in your directive

```js
angular.module('yourapp').directive('yourDirective', ['EqualizerState', function(EqualizerState){
  return {
    link: function(scope, el, attr){
      EqualizerState.add('yourDirective', el);
      EqualizerState.add('yourDirective', angular.element('<div/>'));
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

Needs jQuery and Lo-dash/Underscore (for the debounce function)

### License 

MIT

  angular.module('ngEqualizer', []).factory('EqualizerState', [
    '$window', function($window) {
      var equalize, items;
      items = {};
      $window = $($window);
      equalize = _.debounce(function() {
        var item, name, _fn;
        _fn = function(item, name) {
          var i, maxHeight, _i, _j, _k, _len, _len1, _len2;
          maxHeight = 0;
          for (_i = 0, _len = item.length; _i < _len; _i++) {
            i = item[_i];
            i.element.css({
              'minHeight': i.minHeight,
              'height': 'auto'
            });
          }
          for (_j = 0, _len1 = item.length; _j < _len1; _j++) {
            i = item[_j];
            maxHeight = Math.max(maxHeight, i.element.outerHeight());
          }
          if (maxHeight > 0) {
            for (_k = 0, _len2 = item.length; _k < _len2; _k++) {
              i = item[_k];
              i.element.css('minHeight', maxHeight);
            }
          }
        };
        for (name in items) {
          item = items[name];
          _fn(item, name);
        }
      }, 30);
      $window.on('resize', equalize);
      return {
        get: function(group) {
          return items[group] || [];
        },
        add: function(group, element) {
          if (!angular.isArray(items[group])) {
            items[group] = [];
          }
          items[group].push({
            height: element.css('height') || 'auto',
            minHeight: element.css('minHeight') || 0,
            element: element
          });
          equalize();
          return this;
        },
        remove: function(group, element) {
          var i, key, _ref;
          _ref = items[group];
          for (key in _ref) {
            i = _ref[key];
            if (i.element === element) {
              element.css({
                'minHeight': i.minHeight,
                'height': i.height
              });
              items[group].splice(key, 1);
              break;
            }
          }
          return this;
        },
        equalize: equalize
      };
    }
  ]).directive('equalizer', [
    'EqualizerState', function(EqualizerState) {
      return {
        restrict: 'A',
        link: function(scope, el, attr) {
          var group;
          group = scope.$eval(attr.equalizer);
          EqualizerState.add(group, el);
          el.on('$destroy', function() {
            EqualizerState.remove(group, el);
          });
          scope.$on('$destroy', function() {
            EqualizerState.remove(group, el);
          });
        }
      };
    }
  ]);

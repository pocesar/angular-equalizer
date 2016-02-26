(function(){
    var ngEqualizer;
    (function (ngEqualizer) {
        'use strict';
        var Services;
        (function (Services) {
            var EqualizerState = (function () {
                function EqualizerState($window) {
                    var _this = this;
                    this.items = {};
                    this.updating = false;
                    var _window = $($window);
                    this.equalize = function (time) {
                        function fn(item) {
                            var maxHeight;
                            maxHeight = 0;
                            angular.forEach(item, function (i) {
                                i.element.css({
                                    'minHeight': i.minHeight,
                                    'height': 'auto'
                                });
                            });
                            angular.forEach(item, function (i) {
                                maxHeight = Math.max(maxHeight, i.element.outerHeight());
                            });
                            if (maxHeight > 0) {
                                angular.forEach(item, function (i) {
                                    i.element.css(i.method, maxHeight);
                                });
                            }
                        }
                        angular.forEach(_this.items, fn);
                        _this.updating = false;
                    };
                    _window.on({
                        'resize': function () {
                            _this.request();
                        }
                    });
                }
                EqualizerState.prototype.get = function (group) {
                    return this.items[group] || [];
                };
                EqualizerState.prototype.request = function () {
                    if (this.updating === false) {
                        requestAnimationFrame(this.equalize);
                        this.updating = true;
                    }
                };
                EqualizerState.prototype.add = function (group, element, method) {
                    if (method === void 0) { method = 'minHeight'; }
                    if (!angular.isArray(this.items[group])) {
                        this.items[group] = [];
                    }
                    this.items[group].push({
                        height: element.css('height') || 'auto',
                        minHeight: element.css('minHeight') || '0',
                        method: method,
                        element: element
                    });
                    this.request();
                    return this;
                };
                EqualizerState.prototype.remove = function (group, element) {
                    var _this = this;
                    angular.forEach(this.items[group], function (i, key) {
                        if (i.element === element) {
                            element.css({
                                'minHeight': i.minHeight,
                                'height': i.height
                            });
                            _this.items[group].splice(key, 1);
                            return false;
                        }
                    });
                    return this;
                };
                EqualizerState.$inject = ['$window'];
                return EqualizerState;
            })();
            Services.EqualizerState = EqualizerState;
        })(Services = ngEqualizer.Services || (ngEqualizer.Services = {}));
        var Controllers;
        (function (Controllers) {
            var Equalizer = (function () {
                function Equalizer(EqualizerState) {
                    this.EqualizerState = EqualizerState;
                }
                Equalizer.prototype.add = function (scope, group, el, method) {
                    var _this = this;
                    this.EqualizerState.add(group, el, method);
                    el.on('$destroy', function () {
                        _this.EqualizerState.remove(group, el);
                    });
                    scope.$on('$destroy', function () {
                        _this.EqualizerState.remove(group, el);
                    });
                };
                Equalizer.$inject = ['EqualizerState'];
                return Equalizer;
            })();
            Controllers.Equalizer = Equalizer;
        })(Controllers || (Controllers = {}));
        var Directives;
        (function (Directives) {
            var Equalizer = (function () {
                function Equalizer() {
                    this.restrict = 'A';
                    this.controller = Controllers.Equalizer;
                }
                Equalizer.prototype.link = function (scope, el, attr, ctrl) {
                    var group = scope.$eval(attr['equalizer']);
                    ctrl.add(scope, group, el, attr['equalizerMethod']);
                };
                Equalizer.instance = function () {
                    var _this = this;
                    return [function () { return new _this(); }];
                };
                return Equalizer;
            })();
            Directives.equalizer = Equalizer.instance();
        })(Directives || (Directives = {}));
        
        angular.module('ngEqualizer', []).service(Services).directive(Directives);
    })(ngEqualizer || (ngEqualizer = {}));
})();

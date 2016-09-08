(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'angular', 'lodash'], factory);
    }
})(function (require, exports) {
    'use strict';
    var angular = require('angular');
    var _ = require('lodash');
    var Services;
    (function (Services) {
        var EqualizerState = (function () {
            function EqualizerState($rootScope) {
                var _this = this;
                this.items = {};
                var register = function () {
                    requestAnimationFrame ? requestAnimationFrame(_this.equalize) : setTimeout(function () {
                        _this.equalize(0);
                    }, 600);
                };
                this.equalize = _.throttle(function (time) {
                    function fn(item) {
                        var maxHeight;
                        maxHeight = 0;
                        if (item.lastHeight !== maxHeight) {
                            _.forEach(item.items, function (i) {
                                i.element.css({
                                    'minHeight': i.minHeight,
                                    'height': 'auto'
                                });
                            });
                            _.forEach(item.items, function (i) {
                                maxHeight = Math.max(maxHeight, i.element.outerHeight());
                            });
                            if (maxHeight > 0) {
                                _.forEach(item.items, function (i) {
                                    i.element.css(i.method, maxHeight);
                                });
                                item.lastHeight = maxHeight;
                            }
                        }
                    }
                    _.forEach(_this.items, fn);
                }, 1000 / 60);
                $rootScope.$watch(function () {
                    register();
                });
            }
            EqualizerState.prototype.get = function (group) {
                return this.items[group] ? (this.items[group].items || []) : [];
            };
            EqualizerState.prototype.add = function (group, element, method) {
                if (method === void 0) { method = 'minHeight'; }
                if (typeof this.items[group] === 'undefined') {
                    this.items[group] = {
                        items: [],
                        lastHeight: NaN
                    };
                }
                this.items[group].items.push({
                    height: element.css('height') || 'auto',
                    minHeight: element.css('minHeight') || '0',
                    method: method,
                    element: element
                });
                return this;
            };
            EqualizerState.prototype.remove = function (group, element) {
                if (typeof this.items[group] !== 'undefined') {
                    for (var x = 0; x < this.items[group].items.length; x++) {
                        var i = this.items[group].items[x];
                        if (i.element === element) {
                            element.css({
                                'minHeight': i.minHeight,
                                'height': i.height
                            });
                            this.items[group].items.splice(x, 1);
                            break;
                        }
                    }
                }
                return this;
            };
            EqualizerState.$inject = ['$rootScope'];
            return EqualizerState;
        }());
        Services.EqualizerState = EqualizerState;
    })(Services = exports.Services || (exports.Services = {}));
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
        }());
        Controllers.Equalizer = Equalizer;
    })(Controllers || (Controllers = {}));
    var Directives;
    (function (Directives) {
        var Equalizer = (function () {
            function Equalizer() {
                this.restrict = 'A';
                this.controller = Controllers.Equalizer;
                this.link = {
                    post: function (scope, el, attr, ctrl) {
                        var group = scope.$eval(attr['equalizer']);
                        ctrl.add(scope, group, el, attr['equalizerMethod']);
                    }
                };
            }
            Equalizer.instance = function () {
                var _this = this;
                return [function () { return new _this(); }];
            };
            return Equalizer;
        }());
        Directives.equalizer = Equalizer.instance();
    })(Directives || (Directives = {}));
    angular
        .module('ngEqualizer', [])
        .service(Services)
        .directive(Directives);
});

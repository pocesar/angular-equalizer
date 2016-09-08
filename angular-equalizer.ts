'use strict';

import * as angular from 'angular'
import * as _ from 'lodash'

export interface IEqualizeItem {
    element: angular.IAugmentedJQuery;
    height: string;
    minHeight: string;
    method: string;
}
export interface IEqualizeItemGroup {
    items: IEqualizeItem[];
    lastHeight: number;
}
export interface IEqualizeItems {
    [index: string]: IEqualizeItemGroup;
}

export module Services {

    export class EqualizerState {
        static $inject = ['$rootScope'];

        private items: IEqualizeItems = {};
        public equalize: FrameRequestCallback;

        get(group: string): IEqualizeItem[] {
            return this.items[group] ? (this.items[group].items || []) : [];
        }

        add(group: string, element: angular.IAugmentedJQuery, method: string = 'minHeight'): EqualizerState {
            if (typeof this.items[group] === 'undefined') {
                this.items[group] = {
                    items: [],
                    lastHeight: NaN
                }
            }

            this.items[group].items.push({
                height: element.css('height') || 'auto',
                minHeight: element.css('minHeight') || '0',
                method: method,
                element: element
            });

            return this;
        }

        remove(group: string, element: angular.IAugmentedJQuery): EqualizerState {
            if (typeof this.items[group] !== 'undefined') {

                for (let x = 0; x < this.items[group].items.length; x++) {
                    let i = this.items[group].items[x];

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
        }

        constructor($rootScope: angular.IRootScopeService) {
            let register = () => {
                requestAnimationFrame ? requestAnimationFrame(this.equalize) : setTimeout(() => {
                    this.equalize(0)
                }, 600);
            }

            this.equalize = _.throttle((time: number) => {

                function fn(item: IEqualizeItemGroup) {
                    var maxHeight: number;

                    maxHeight = 0;

                    if (item.lastHeight !== maxHeight) {

                        _.forEach(item.items, (i) => {
                            i.element.css({
                                'minHeight': i.minHeight,
                                'height': 'auto'
                            });
                        });

                        _.forEach(item.items, (i) => {
                            maxHeight = Math.max(maxHeight, i.element.outerHeight());
                        });

                        if (maxHeight > 0) {
                            _.forEach(item.items, (i) => {
                                i.element.css(i.method, maxHeight);
                            });

                            item.lastHeight = maxHeight;
                        }

                    }

                }

                _.forEach(this.items, fn);
            }, 1000 / 60);

            $rootScope.$watch(() => {
                register()
            })
        }
    }
}

module Controllers {

    export class Equalizer {
        static $inject = ['EqualizerState'];

        constructor(public EqualizerState: Services.EqualizerState) { }

        add(scope: angular.IScope, group: string, el: angular.IAugmentedJQuery, method: string) {
            this.EqualizerState.add(group, el, method);

            el.on('$destroy', () => {
                this.EqualizerState.remove(group, el);
            });

            scope.$on('$destroy', () => {
                this.EqualizerState.remove(group, el);
            });
        }
    }
}

module Directives {

    class Equalizer implements angular.IDirective {
        restrict = 'A';
        controller = Controllers.Equalizer;

        link: angular.IDirectivePrePost = {
            post: (scope: angular.IScope, el: angular.IAugmentedJQuery, attr: angular.IAttributes, ctrl: Controllers.Equalizer) => {
                var group = scope.$eval(attr['equalizer']);

                ctrl.add(scope, group, el, attr['equalizerMethod']);
            }
        }

        static instance(){
            return [() => new this()];
        }
    }

    export var equalizer: angular.IDirective[] = Equalizer.instance();
}

angular
.module('ngEqualizer', [])
.service(Services)
.directive(Directives)
;
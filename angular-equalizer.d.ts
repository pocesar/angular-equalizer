/// <reference types="angular" />
import * as angular from 'angular';
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
export declare module Services {
    class EqualizerState {
        static $inject: string[];
        private items;
        equalize: FrameRequestCallback;
        get(group: string): IEqualizeItem[];
        add(group: string, element: angular.IAugmentedJQuery, method?: string): EqualizerState;
        remove(group: string, element: angular.IAugmentedJQuery): EqualizerState;
        constructor($rootScope: angular.IRootScopeService);
    }
}

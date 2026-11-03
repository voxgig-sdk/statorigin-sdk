import { IndicatorEntity } from './entity/IndicatorEntity';
import { IndustryEntity } from './entity/IndustryEntity';
import { RegionEntity } from './entity/RegionEntity';
import { SearchEntity } from './entity/SearchEntity';
import { SourceEntity } from './entity/SourceEntity';
import { StatisticEntity } from './entity/StatisticEntity';
export type * from './StatoriginTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { StatoriginEntityBase } from './StatoriginEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
type DirectResult = {
    ok: false;
    err: any;
    status?: undefined;
    headers?: undefined;
    data?: undefined;
} | {
    ok: boolean;
    status: number;
    headers: any;
    data: any;
    err?: any;
};
declare class StatoriginSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<DirectResult>;
    _rawRequest(fetchargs?: any): Promise<DirectResult>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Indicator(entopts?: Record<string, any>): IndicatorEntity;
    Industry(entopts?: Record<string, any>): IndustryEntity;
    Region(entopts?: Record<string, any>): RegionEntity;
    Search(entopts?: Record<string, any>): SearchEntity;
    Source(entopts?: Record<string, any>): SourceEntity;
    Statistic(entopts?: Record<string, any>): StatisticEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): StatoriginSDK;
    tester(testopts?: any, sdkopts?: any): StatoriginSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof StatoriginSDK;
export { stdutil, config, BaseFeature, StatoriginEntityBase, StatoriginSDK, SDK, };
export type { DirectResult };

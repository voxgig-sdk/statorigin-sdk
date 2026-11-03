import { StatoriginEntityBase } from '../StatoriginEntityBase';
import type { StatoriginSDK } from '../StatoriginSDK';
import type { Control } from '../types';
import type { Indicator, IndicatorLoadMatch, IndicatorListMatch } from '../StatoriginTypes';
declare class IndicatorEntity extends StatoriginEntityBase<Indicator> {
    constructor(client: StatoriginSDK, entopts: any);
    make(this: IndicatorEntity): IndicatorEntity;
    load(this: any, reqmatch?: IndicatorLoadMatch, ctrl?: Control): Promise<IndicatorEntity>;
    list(this: any, reqmatch?: IndicatorListMatch, ctrl?: Control): Promise<IndicatorEntity[]>;
}
export { IndicatorEntity };

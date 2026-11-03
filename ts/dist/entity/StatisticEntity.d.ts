import { StatoriginEntityBase } from '../StatoriginEntityBase';
import type { StatoriginSDK } from '../StatoriginSDK';
import type { Control } from '../types';
import type { Statistic, StatisticLoadMatch, StatisticListMatch } from '../StatoriginTypes';
declare class StatisticEntity extends StatoriginEntityBase<Statistic> {
    constructor(client: StatoriginSDK, entopts: any);
    make(this: StatisticEntity): StatisticEntity;
    load(this: any, reqmatch?: StatisticLoadMatch, ctrl?: Control): Promise<StatisticEntity>;
    list(this: any, reqmatch?: StatisticListMatch, ctrl?: Control): Promise<StatisticEntity[]>;
}
export { StatisticEntity };

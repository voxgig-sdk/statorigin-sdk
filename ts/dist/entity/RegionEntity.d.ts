import { StatoriginEntityBase } from '../StatoriginEntityBase';
import type { StatoriginSDK } from '../StatoriginSDK';
import type { Control } from '../types';
import type { Region, RegionListMatch } from '../StatoriginTypes';
declare class RegionEntity extends StatoriginEntityBase<Region> {
    constructor(client: StatoriginSDK, entopts: any);
    make(this: RegionEntity): RegionEntity;
    list(this: any, reqmatch?: RegionListMatch, ctrl?: Control): Promise<RegionEntity[]>;
}
export { RegionEntity };

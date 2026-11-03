import { StatoriginEntityBase } from '../StatoriginEntityBase';
import type { StatoriginSDK } from '../StatoriginSDK';
import type { Control } from '../types';
import type { Industry, IndustryLoadMatch, IndustryListMatch } from '../StatoriginTypes';
declare class IndustryEntity extends StatoriginEntityBase<Industry> {
    constructor(client: StatoriginSDK, entopts: any);
    make(this: IndustryEntity): IndustryEntity;
    load(this: any, reqmatch?: IndustryLoadMatch, ctrl?: Control): Promise<IndustryEntity>;
    list(this: any, reqmatch?: IndustryListMatch, ctrl?: Control): Promise<IndustryEntity[]>;
}
export { IndustryEntity };

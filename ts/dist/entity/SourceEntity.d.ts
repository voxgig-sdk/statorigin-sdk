import { StatoriginEntityBase } from '../StatoriginEntityBase';
import type { StatoriginSDK } from '../StatoriginSDK';
import type { Control } from '../types';
import type { Source, SourceLoadMatch, SourceListMatch } from '../StatoriginTypes';
declare class SourceEntity extends StatoriginEntityBase<Source> {
    constructor(client: StatoriginSDK, entopts: any);
    make(this: SourceEntity): SourceEntity;
    load(this: any, reqmatch?: SourceLoadMatch, ctrl?: Control): Promise<SourceEntity>;
    list(this: any, reqmatch?: SourceListMatch, ctrl?: Control): Promise<SourceEntity[]>;
}
export { SourceEntity };

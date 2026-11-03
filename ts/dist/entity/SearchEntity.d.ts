import { StatoriginEntityBase } from '../StatoriginEntityBase';
import type { StatoriginSDK } from '../StatoriginSDK';
import type { Control } from '../types';
import type { Search, SearchLoadMatch } from '../StatoriginTypes';
declare class SearchEntity extends StatoriginEntityBase<Search> {
    constructor(client: StatoriginSDK, entopts: any);
    make(this: SearchEntity): SearchEntity;
    load(this: any, reqmatch?: SearchLoadMatch, ctrl?: Control): Promise<SearchEntity>;
}
export { SearchEntity };

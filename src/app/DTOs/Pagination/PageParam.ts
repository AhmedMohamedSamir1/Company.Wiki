import { SearchType } from './../../Enums/SearchType';
export interface PageParam
{
    SearchText?: string | null;
    PageNumber?:number | null ;
    SearchType?: SearchType;
}
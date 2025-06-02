import { DataResource } from "../../Enums/DataResource"

export interface UserPersmissionDTO
{
    tableName: DataResource, 
    view : boolean,  
    edit : boolean,  
    delete : boolean,  
    add  : boolean, 

}
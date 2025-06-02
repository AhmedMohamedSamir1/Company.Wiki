import { SearchType } from './../Enums/SearchType';
import { ProjectDTO } from './../DTOs/Project/ProjectDTO';
import { Injectable } from "@angular/core";

import * as signalR from '@microsoft/signalr';


import { environment } from "../../Environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, catchError, Observable, of } from "rxjs";
import { IApiResponse, IApiResponseGeneric } from "../Interfaces/IApiResponse";
import { ProjectGetDTO } from '../DTOs/Project/ProjectGetDTO';
import { ICountResponse } from '../Interfaces/ICountResponse';
import { PagedListDTO } from '../DTOs/Pagination/PagedListDTO';
import { PageParam } from '../DTOs/Pagination/PageParam';
import { toQueryString } from '../Shared/toQueryString';
import { IHttpErrorResponse } from '../Interfaces/IHttpErrorResponse';

@Injectable({
    providedIn: 'root'
})

export class ProjectService{

    private baseUrl: string = environment.apiUrl;

    constructor(private http: HttpClient){
    }



    public getPagedList( pageParam:PageParam): Observable< PagedListDTO<ProjectGetDTO> >{
        const url = `${this.baseUrl}/project/GetPagedList?${toQueryString(pageParam)}`;
        return this.http.get<PagedListDTO<ProjectGetDTO>>(url)
            .pipe(catchError(this.handleError<PagedListDTO<ProjectGetDTO>>('getPagedList')));
    }

    public isProjectNameUnique(name: string, id: number|null = null): Observable<IApiResponse>{
        const url = `${this.baseUrl}/project/IsNameUnique?name=${name}&id=${id}`;
        return this.http.get<IApiResponse>(url).pipe(catchError(this.handleError<IApiResponse>('isTagNameUnique')));     
    }

    public addProject( projectDTO: ProjectDTO): Observable<IApiResponse>
    {
        const url = `${this.baseUrl}/project`;
        return this.http.post<IApiResponse>(url, projectDTO)
        .pipe(catchError(this.handleError<IApiResponse>('addProject')));
    }


    public getAllProjects(): Observable<ProjectGetDTO[]>{
        const url = `${this.baseUrl}/project/All`;
        return this.http.get<ProjectGetDTO[]>(url)
            .pipe(catchError(this.handleError<ProjectGetDTO[]>('getAllProjects')));
    }
    

    public getById(id: Number): Observable<IApiResponseGeneric<ProjectGetDTO>> {

        const url = `${this.baseUrl}/project/${id}`;
        return this.http.get<IApiResponseGeneric<ProjectGetDTO>>(url).pipe(
            catchError((httpError: IHttpErrorResponse<IApiResponseGeneric<ProjectGetDTO>>)=>{
                httpError.apiErrorResponse = httpError.error;
              return of(httpError.apiErrorResponse!); // wraps a value inside an Observable and immediately emits it.

            })
        );        
    }

    public getProjectsCount(searchType: SearchType | null =null, text: string| null = null): Observable<ICountResponse>{

        const url = (SearchType==null || text == null)?
         `${this.baseUrl}/project/count`: `${this.baseUrl}/project/count?searchType=${searchType}&text=${text}`;
       
        return this.http.get<ICountResponse>(url)
        .pipe(catchError(this.handleError<ICountResponse>('getProjectsCount')));
        
    }

    public editProject(id: Number, projectDTO: ProjectDTO): Observable<IApiResponse>{
        const url = `${this.baseUrl}/project/${id}`;
        return this.http.put<IApiResponse>(url, projectDTO).pipe(catchError(this.handleError<IApiResponse>('editProject')));        
    }

    public deleteProject(id: Number): Observable<IApiResponse>{
        const url = `${this.baseUrl}/project/${id}`;
        return this.http.delete<IApiResponse>(url).pipe(catchError(this.handleError<IApiResponse>('deleteProject')));   
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            // You can log the error to remote logging infrastructure if needed
            // Let the app keep running by returning an empty result
            return of(result as T);
        };
    }
    
}
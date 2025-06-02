import { TagDTO } from './../DTOs/Tag/TagDTO';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../Environments/environment.development";
import { IApiResponse, IApiResponseGeneric } from "../Interfaces/IApiResponse";
import { catchError, Observable, of } from "rxjs";
import { TagGetDTO } from '../DTOs/Tag/TagGetDTO';
import { PageParam } from '../DTOs/Pagination/PageParam';
import { PagedListDTO } from '../DTOs/Pagination/PagedListDTO';
import { toQueryString } from '../Shared/toQueryString';


@Injectable({
    providedIn:'root'
})


export class TagService {

    private baseUrl: string = environment.apiUrl;
    
    constructor(private http: HttpClient){

    }

    // https://localhost:7128/api/Tag/GetPagedList?PageNumber=2
    // https://localhost:7128/api/tag/GetPagedList?/PageNumber=2

    public getPagedList( pageParam:PageParam): Observable< PagedListDTO<TagGetDTO> >{
        const url = `${this.baseUrl}/tag/GetPagedList?${toQueryString(pageParam)}`;
        return this.http.get<PagedListDTO<TagGetDTO>>(url)
        .pipe(catchError(this.handleError<PagedListDTO<TagGetDTO>>('getPagedList')));
    }


    public addTagAndReturn(tagDTO:TagDTO): Observable<IApiResponseGeneric<TagGetDTO>>{
        const url = `${this.baseUrl}/tag/AddAndReturn`;
        return this.http.post<IApiResponseGeneric<TagGetDTO>>(url, tagDTO)
        .pipe(catchError(this.handleError<IApiResponseGeneric<TagGetDTO>>('addTagAndReturn')));
    }

    public addTag(tagDTO:TagDTO): Observable<IApiResponse>{
        const url = `${this.baseUrl}/tag`;
        return this.http.post<IApiResponse>(url, tagDTO)
        .pipe(catchError(this.handleError<IApiResponse>('addTag')));
    }

    public editTag(id: number, tagDTO: TagDTO): Observable<IApiResponse>{
        const url = `${this.baseUrl}/tag/${id}`;
        return this.http.put<IApiResponse>(url, tagDTO)
        .pipe(catchError(this.handleError<IApiResponse>('editTag')));
    }

    public deleteTag(id: number): Observable<IApiResponse>{
        const url = `${this.baseUrl}/tag/${id}`;
        return this.http.delete<IApiResponse>(url)
        .pipe(catchError(this.handleError<IApiResponse>('deleteTag')));

    }

    public isTagNameUnique(name: string, id: number|null = null): Observable<IApiResponse>{
        const url = `${this.baseUrl}/tag/IsTagNameUnique?tagName=${name}&id=${id}`;
        return this.http.get<IApiResponse>(url).pipe(catchError(this.handleError<IApiResponse>('isTagNameUnique')));     
    }

   

    public getAllTags(): Observable<TagGetDTO[]> {

        const url = `${this.baseUrl}/tag/All`;
        return this.http.get<TagGetDTO[]>(url).pipe(catchError(this.handleError<TagGetDTO[]>('getAllTags')));
        
    }

    public getById(id: number): Observable<TagGetDTO> {

        const url = `${this.baseUrl}/tag/${id}`;
        return this.http.get<TagGetDTO>(url).pipe(catchError(this.handleError<TagGetDTO>('getAllTags')));
        
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
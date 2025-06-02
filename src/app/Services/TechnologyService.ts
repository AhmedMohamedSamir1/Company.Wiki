import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../Environments/environment.development';
import { IApiResponse, IApiResponseGeneric } from '../Interfaces/IApiResponse';
import { catchError, Observable, of } from 'rxjs';
import { TechnologyDTO } from '../DTOs/Technology/TechnologyDTO';
import { TechnologyGetDTO } from '../DTOs/Technology/TechnologyGetDTO';
import { toQueryString } from '../Shared/toQueryString';
import { PageParam } from '../DTOs/Pagination/PageParam';
import { PagedListDTO } from '../DTOs/Pagination/PagedListDTO';

@Injectable({
    providedIn: 'root',
})
export class TechnologyService {
    private baseUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {}

    public getPagedList( pageParam:PageParam): Observable< PagedListDTO<TechnologyGetDTO> >{

        const url = `${this.baseUrl}/technology/GetPagedList?${toQueryString(pageParam)}`;

        return this.http.get<PagedListDTO<TechnologyGetDTO>>(url)
        .pipe(catchError(this.handleError<PagedListDTO<TechnologyGetDTO>>('getPagedList')));
    }

    public addTechnology(technologyDTO: TechnologyDTO): Observable<IApiResponse> {
        const url = `${this.baseUrl}/technology`;
        return this.http.post<IApiResponse>(url, technologyDTO)
            .pipe(catchError(this.handleError<IApiResponse>('addTechnology')));
    }

    public addAndReturn(technologyDTO:TechnologyDTO): Observable<IApiResponseGeneric<TechnologyGetDTO>>{
        const url = `${this.baseUrl}/technology/AddAndReturn`;
        return this.http.post<IApiResponseGeneric<TechnologyGetDTO>>(url, technologyDTO)
            .pipe(catchError(this.handleError<IApiResponseGeneric<TechnologyGetDTO>>('addTagAndReturn')));
    }

    public editTechnology(id: number, technologyDTO: TechnologyDTO): Observable<IApiResponse> {
        const url = `${this.baseUrl}/technology/${id}`;
        return this.http.put<IApiResponse>(url, technologyDTO)
            .pipe(catchError(this.handleError<IApiResponse>('editTechnology')));
    }

    public deleteTechnology(id: number): Observable<IApiResponse> {
        const url = `${this.baseUrl}/technology/${id}`;
        return this.http.delete<IApiResponse>(url)
            .pipe(catchError(this.handleError<IApiResponse>('deleteTechnology')));
    }

    public isTechnologyNameUnique(name: string, id: number|null=null): Observable<IApiResponse> {
        const url = `${this.baseUrl}/technology/IsTechnologyNameUnique?technologyName=${name}&id=${id}`;
        return this.http.get<IApiResponse>(url).pipe(catchError(this.handleError<IApiResponse>('isTechnologyNameUnique')));
    }

    public getAllTechnologies(): Observable<TechnologyGetDTO[]> {
        const url = `${this.baseUrl}/technology/all`;
        return this.http.get<TechnologyGetDTO[]>(url)
            .pipe(catchError(this.handleError<TechnologyGetDTO[]>('getAllTechnologies')));
    }

    public getById(id: number): Observable<TechnologyGetDTO> {
        const url = `${this.baseUrl}/technology/${id}`;
        return this.http.get<TechnologyGetDTO>(url)
            .pipe(catchError(this.handleError<TechnologyGetDTO>('getById')));
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error); // Log the error to the console
            // You can log the error to remote logging infrastructure if needed
            // Let the app keep running by returning an empty result
            return of(result as T);
        };
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../Environments/environment.development';
import { IApiResponse, IApiResponseGeneric } from '../Interfaces/IApiResponse';
import { DependencyDTO } from '../DTOs/Dependency/DependencyDTO'; // Adjust the import path as necessary
import { DependencyGetDTO } from '../DTOs/Dependency/DependencyGetDTO'; // Adjust the import path as necessary
import { catchError, Observable, of } from 'rxjs';
import { PageParam } from '../DTOs/Pagination/PageParam';
import { PagedListDTO } from '../DTOs/Pagination/PagedListDTO';
import { toQueryString } from '../Shared/toQueryString';

@Injectable({
    providedIn: 'root',
})
export class DependencyService {
    private baseUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {}

    public getPagedList( pageParam:PageParam): Observable< PagedListDTO<DependencyGetDTO> >{
        const url = `${this.baseUrl}/dependency/GetPagedList?${toQueryString(pageParam)}`;
        return this.http.get<PagedListDTO<DependencyGetDTO>>(url)
        .pipe(catchError(this.handleError<PagedListDTO<DependencyGetDTO>>('getPagedList')));
    }

    public addDependency(dependencyDTO: DependencyDTO): Observable<IApiResponse> {
        const url = `${this.baseUrl}/dependency`;
        return this.http.post<IApiResponse>(url, dependencyDTO)
            .pipe(catchError(this.handleError<IApiResponse>('addDependency')));
    }

    public addAndReturn(dependencyDTO:DependencyDTO): Observable<IApiResponseGeneric<DependencyGetDTO>>{
        const url = `${this.baseUrl}/dependency/AddAndReturn`;
        return this.http.post<IApiResponseGeneric<DependencyGetDTO>>(url, dependencyDTO)
            .pipe(catchError(this.handleError<IApiResponseGeneric<DependencyGetDTO>>('addDependencyAndReturn')));
}

    public editDependency(id: number, dependencyDTO: DependencyDTO): Observable<IApiResponse> {
        const url = `${this.baseUrl}/dependency/${id}`;
        return this.http.put<IApiResponse>(url, dependencyDTO)
            .pipe(catchError(this.handleError<IApiResponse>('editDependency')));
    }

    public deleteDependency(id: number): Observable<IApiResponse> {
        const url = `${this.baseUrl}/dependency/${id}`;
        return this.http.delete<IApiResponse>(url)
            .pipe(catchError(this.handleError<IApiResponse>('deleteDependency')));
    }

   

    public isDependencyNameUnique(name: string, id?: number): Observable<IApiResponse> {
        

        const url = `${this.baseUrl}/dependency/IsDependencyNameUnique?dependencyName=${name}&id=${id}`;

        return this.http.get<IApiResponse>(url)
            .pipe(catchError(this.handleError<IApiResponse>('isDependencyNameUnique')));
    }

    public getAllDependencies(): Observable<DependencyGetDTO[]> {
        const url = `${this.baseUrl}/dependency/all`;
        return this.http.get<DependencyGetDTO[]>(url)
            .pipe(catchError(this.handleError<DependencyGetDTO[]>('getAllDependencies')));
    }

    public getById(id: number): Observable<DependencyGetDTO> {
        const url = `${this.baseUrl}/dependency/${id}`;
        return this.http.get<DependencyGetDTO>(url)
            .pipe(catchError(this.handleError<DependencyGetDTO>('getById')));
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

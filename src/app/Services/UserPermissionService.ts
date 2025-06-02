import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of } from "rxjs";
import { UserPersmissionDTO } from "../DTOs/UserPermission/UserPermissions";
import { environment } from "../../Environments/environment.development";
import { IApiResponse } from "../Interfaces/IApiResponse";
import { IHttpErrorResponse } from "../Interfaces/IHttpErrorResponse";


@Injectable({
    providedIn: 'root',
})

export class UserPermissionService {

    private baseUrl: string = `${environment.apiUrl}/UserPermission`;
    constructor(private http: HttpClient) {}
    
    public getUserPermissions(id: string ): Observable<UserPersmissionDTO[]>{
        const url = `${this.baseUrl}/GetUserPermissions?id=${id}`;
        return this.http.get<UserPersmissionDTO[]>(url)
        .pipe(catchError(this.handleError<UserPersmissionDTO[]>('getUserPermissions')));
    }


    public editUserPermissions(id: string, userPersmissionsDTO: UserPersmissionDTO[]): Observable<IApiResponse>{
        const url = `${this.baseUrl}/EditUserPermissions/${id}`;
        return this.http.put<IApiResponse>(url, userPersmissionsDTO)
        .pipe(
            catchError((error: IHttpErrorResponse<IApiResponse>) => {
                return of({
                    success: false,
                    message: error.apiErrorResponse?.message ?? 'error while editing user permissions',
                    status: 400,
                } as IApiResponse);
            })
        );
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
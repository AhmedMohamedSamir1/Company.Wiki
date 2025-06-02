import { IApiResponse } from './../Interfaces/IApiResponse';
import { LoginDTO } from '../DTOs/User/LoginDTO';
import { UserDTO } from '../DTOs/User/UserDTO';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../Environments/environment.development';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginResultDTO } from '../DTOs/User/LoginResultDTO';
import { SendEmailDTO } from '../DTOs/User/SendEmailDTO';
import { ResetPasswordDTO } from '../DTOs/User/ResetPasswordDTO';
import { UserGetDTO } from '../DTOs/User/UserGetDTO';
import { IHttpErrorResponse } from '../Interfaces/IHttpErrorResponse';
import { NotificationGetDTO } from '../DTOs/Notification/NotificationGetDTO';



@Injectable({
    providedIn: 'root', // Makes it available throughout the app
  })
export class UserService{
    
    private baseUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) { }
    
    public registerUser(user:UserDTO): Observable<IApiResponse>{
        const url = `${this.baseUrl}/user`;
        return this.http.post<IApiResponse>(url, user)
        .pipe(catchError(this.handleError<IApiResponse>('registerUser')));
    }

    public registerAdmin(user:UserDTO): Observable<IApiResponse>{

        const url = `${this.baseUrl}/User/RegisterAdmin`;
        return this.http.post<IApiResponse>(url, user)
        .pipe(catchError(this.handleError<IApiResponse>('registerUser')));
    }


    public isEmailUnique(email: string, id:string|null = null):  Observable<IApiResponse>{
        const url = `${this.baseUrl}/user/isEmailUnique?email=${email}&id=${id}`;
        return this.http.get<IApiResponse>(url)
        .pipe(catchError(this.handleError<IApiResponse>('isEmailUnique')));
    }


    public Login(userLoginDTO: LoginDTO): Observable<LoginResultDTO> {
        const url = `${this.baseUrl}/User/login`;
        return this.http.post<LoginResultDTO>(url, userLoginDTO)
        .pipe(   
            catchError((httpError: IHttpErrorResponse<LoginResultDTO>) => {
                httpError.apiErrorResponse = httpError.error;
                return of(httpError.apiErrorResponse!); // wraps a value inside an Observable and immediately emits it.
            })
        );
    }


    public sendResetEmail(sendEmailDTO: SendEmailDTO):Observable<IApiResponse>{
        const url = `${this.baseUrl}/User/sendResetEmail`;     
        return this.http.post<IApiResponse>(url,sendEmailDTO).pipe(
            catchError( (httpError: IHttpErrorResponse<IApiResponse>)=>{
                httpError.apiErrorResponse = httpError.error;
                return of( httpError.apiErrorResponse!)
            })
        )
    } 

    public resetPassword(resetPasswordDTO: ResetPasswordDTO): Observable<IApiResponse> {
        const url = `${this.baseUrl}/User/resetPassword`;
    
        return this.http.post<IApiResponse>(url, resetPasswordDTO).pipe(
            catchError((httpError: IHttpErrorResponse<IApiResponse>) => {
                httpError.apiErrorResponse = httpError.error;
                return of( httpError.apiErrorResponse!)
            })
        );
    }
    
    public getAllUsers(): Observable<UserGetDTO[]>{

        const url = `${this.baseUrl}/User/getAllUsers`;

        return this.http.get<UserGetDTO[]>(url)
            .pipe(catchError(this.handleError<UserGetDTO[]>('registerUser')));
    }


    public getUnreadNotifications(id:string): Observable<NotificationGetDTO[]>{

        const url = `${this.baseUrl}/User/Notifications?id=${id}`;
        return this.http.get<NotificationGetDTO[]>(url)
            .pipe(catchError(this.handleError<NotificationGetDTO[]>('getUnreadNotifications')));
    }


    public readUserNotification(notificationId: number): Observable<IApiResponse>{

        const url = `${this.baseUrl}/User/ReadNotification?notificationId=${notificationId}`;
        return this.http.get<IApiResponse>(url, )
            .pipe(catchError(this.handleError<IApiResponse>('readUserNotification')));
    }
    

      // Error handler method
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
        console.error(error);
        return of(result as T);
    };
}
}
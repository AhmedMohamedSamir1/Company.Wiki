import { HttpErrorResponse } from '@angular/common/http';

export interface IHttpErrorResponse<T> extends HttpErrorResponse {
    apiErrorResponse: T | null; // Custom backend error response
}

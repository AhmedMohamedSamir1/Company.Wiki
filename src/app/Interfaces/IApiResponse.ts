export interface IApiResponse {
    status: number;
    message: string;
    success: boolean;
}

export interface IApiResponseGeneric<T> extends IApiResponse {
    data: T;
}

export interface LoginResultDTO{
    result:boolean,
    code:number,
    isEmailConfirmed:boolean | null,
    token: string| null,
    message: string|null,
}

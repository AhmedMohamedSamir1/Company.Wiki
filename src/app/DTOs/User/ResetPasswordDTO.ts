export interface ResetPasswordDTO{
    UserId: string,
    Token: string ,
    NewPassword: string,
    ConfirmPassword: string
}
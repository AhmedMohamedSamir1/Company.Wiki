import {jwtDecode} from 'jwt-decode';
import { IUserClaims } from '../Interfaces/IUserClaims';
import { RoleConst } from '../Constants/RoleConst';
import { StorageKeysConst } from '../Constants/StorageKeysConst';


export class AuthService {

    static getToken(): string | null {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(StorageKeysConst.UserToken);
      }
      return null;
    }

    static setToken(token: string): void {
        localStorage.setItem(StorageKeysConst.UserToken, token);
    }

    static removeToken(): void {
        localStorage.removeItem(StorageKeysConst.UserToken);
    }

    static getUserClaims(): IUserClaims | null {
      const token = this.getToken();
      if (!token) 
        return null;
      
      try {
        const userClaims: IUserClaims | null = jwtDecode<IUserClaims>(token);
        return  userClaims;

      } catch (error)  
      {
        console.error('Invalid token:', error);
        return null;
      }


    }

    static isAdmin(): boolean{
      const userToken = this.getToken();
      if(userToken!=null){
        if(this.getUserClaims()?.role == RoleConst.Admin)
          return true;
        return false;
      }
      return false;
    }

    static isAuthenticated(): boolean{
      const userToken = this.getToken();
      if(userToken!=null)
          return true;     
      return false;
    }

    static hasPolicy(policyName: string): boolean{
      const userToken = this.getToken();
      if(userToken!=null){
        let userPermissions: string[]  = this.getUserClaims()?.permissions || [];
        var isPolicyExist = userPermissions.includes(policyName);
        return isPolicyExist;
      }
      return false;
    }

    static isUser(): boolean{
      const userToken = this.getToken();
      if(userToken!=null){
        if(this.getUserClaims()?.role == RoleConst.User)
          return true;
        return false;
      }
      return false;
    }


}

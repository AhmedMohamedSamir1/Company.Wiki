import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { StorageKeysConst } from '../Constants/StorageKeysConst';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token = localStorage.getItem(StorageKeysConst.UserToken);
  if (token == null) {
    return next(req);
  }

  let headers = req.headers || new HttpHeaders();
  headers = headers.append('Authorization', `Bearer ${token}`);

  const modifiedReq = req.clone({
    headers: headers,
  });
  return next(modifiedReq);
};
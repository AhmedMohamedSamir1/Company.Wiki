import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/AuthService';

export const adminGaurd: CanActivateFn = (route, state) => {
  const router = inject(Router);
 
  if(AuthService.isAdmin()){
    return true;
  }
  else{
    router.navigate(['/login']);
    return false;
  }
};
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/AuthService';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if(AuthService.isUser()){
    return true;
  }
  else{
    router.navigate(['/login']);
    return false;
  }
};
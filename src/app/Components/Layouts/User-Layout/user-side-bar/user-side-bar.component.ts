import { PolicyNamesConst } from './../../../../Constants/PolicyNamesConst ';
import { AuthService } from './../../../../Services/AuthService';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IUserClaims } from '../../../../Interfaces/IUserClaims';

@Component({
  selector: 'app-user-side-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './user-side-bar.component.html',
  styleUrl: './user-side-bar.component.css'
})
export class UserSideBarComponent {


  userClaims: IUserClaims;
  authService = AuthService;
  PolicyNamesConst = PolicyNamesConst;

  constructor(private router: Router){
    this.userClaims = AuthService.getUserClaims()!;
  }


  toggleSidebar(){ 
    document.querySelector("#sidebar")!.classList.toggle("expand");
  }

  logout(){
    AuthService.removeToken();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
  

}

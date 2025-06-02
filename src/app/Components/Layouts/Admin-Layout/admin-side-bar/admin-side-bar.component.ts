import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../../Services/AuthService';




@Component({
  selector: 'app-admin-side-bar',
  standalone: true,

  imports: [RouterLink, RouterLinkActive],

  templateUrl: './admin-side-bar.component.html',
  styleUrl: './admin-side-bar.component.css'
})
export class AdminSideBarComponent {


  constructor(private router: Router){}

  toggleSidebar(){ 
    document.querySelector("#sidebar")!.classList.toggle("expand");
  }

  logout(){
    AuthService.removeToken();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
  
}

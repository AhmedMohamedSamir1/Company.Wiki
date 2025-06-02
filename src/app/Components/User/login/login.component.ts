import { AuthService } from './../../../Services/AuthService';
import { LoginDTO } from '../../../DTOs/User/LoginDTO';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../Services/UserService';
import { Router, RouterLink } from '@angular/router';
import { RoleConst } from '../../../Constants/RoleConst';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

loginForm = new FormGroup({
  email : new FormControl('', [Validators.required]),
  password: new FormControl('', [Validators.required]),
  rememberMe: new FormControl(),
})

wrongCredentials: boolean = false;
isEmailNotConfirmed: boolean = false;

constructor(private userService: UserService, private router: Router){

}
get getEmail(){return this.loginForm.controls.email;}
get getPassword(){return this.loginForm.controls.password;}
get getRememberMe(){return this.loginForm.controls.rememberMe;}


loginUser(){
  if (this.loginForm.status=="VALID") {
    let UserLoginDTO: LoginDTO = {
      Email: this.getEmail.value!,
      Password: this.getPassword.value!,
      RemembreMe: this.getRememberMe.value || false
    }

    this.userService.Login(UserLoginDTO).subscribe({
      next: (loginRes)=>{
        
        if(loginRes.isEmailConfirmed==false){
          this.isEmailNotConfirmed = true;
        }else if(!loginRes.result){
          this.wrongCredentials = true;
        }else{
          AuthService.setToken(loginRes.token!);
          const appRole = AuthService.getUserClaims()?.role;

          if(appRole == RoleConst.Admin){
            this.router.navigate(['/admin'], { replaceUrl: true });
            
          }else if(appRole == RoleConst.User){
            this.router.navigate(['/user'], {replaceUrl: true})
          }
        }
      },
      error: (error)=>{
        console.log(error);
      }
    })
  }
  else{
    this.loginForm.markAllAsTouched();
  }
}
}

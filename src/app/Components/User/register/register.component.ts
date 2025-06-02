import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';
import { UserService } from '../../../Services/UserService';
import { match } from 'assert';
import { UserDTO } from '../../../DTOs/User/UserDTO';
import { IApiResponse } from '../../../Interfaces/IApiResponse';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import { error } from 'console';
import { Router, RouterLink } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'user-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})


export class RegisterComponent {
  
  alertConfirmYourEmail: boolean;

  constructor(private http: HttpClient, private userService: UserService, private router: Router){
    this.alertConfirmYourEmail = false;
  }

  userForm = new FormGroup({
    email : new FormControl('', [Validators.required, Validators.pattern(/[\w]{4,}[a-zA-Z0-9]{0,}\@(gmail)\.com$/)], [this.emailUniqueValidator()]), 
    name : new FormControl('', [Validators.required]), 
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[\dA-Za-z]{4,})(?=.*[_$@|/\\.&#])[A-Za-z\d_$@|/\\.&]{8,}$/)]),
    phoneNumber: new FormControl('', [Validators.required,  Validators.pattern(/^[0](10|11|12|15)[0-9]{8}$/)],),
  })

  get getEmail(){
    return this.userForm.controls.email;
  }
  get getName(){
    return this.userForm.controls.name;
  }
  get getPassword(){
    return this.userForm.controls.password;
  }

  get getPhoneNumber (){
    return this.userForm.controls.phoneNumber;
  }

  // Asynchronous email uniqueness validator
  emailUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ emailTaken: boolean } | null> => {
      if (!control.value) 
        return of(null); // If no value is provided, skip validation
    
      return this.userService.isEmailUnique(control.value).pipe(
        map(isUnique => (isUnique.success ? null : { emailTaken: true })), // If email is taken, return error object
        catchError(() => of(null)) // In case of an error, skip validation
      );
    };
  }



  registerUser(){

    if (this.userForm.status=="VALID") {

      showSweatAlert('question', 'Question', 'Are you sure with this data',true).then(res=>{
        if(res.isConfirmed){
          
          let userDTO: UserDTO = {
            email: this.getEmail.value!,
            name: this.getName.value!,
            password: this.getPassword.value!,
            phoneNumber: this.getPhoneNumber.value!
          }
          
          this.userService.registerUser(userDTO).subscribe({
            next:(data: IApiResponse)=>{
              if(data.success){
                showSweatAlert('info', 'Info', 'user registered successfully \n confirm your email to complete the registration').then(res=>{
                  if(res.isConfirmed|| res.dismiss){
                    this.alertConfirmYourEmail = true;

                  }
                });
              }
            },
            error:(error)=> {console.log(error);}
          })

        }
      })   
    } else{
      this.userForm.markAllAsTouched();
    }

  }
}

import { Component } from '@angular/core';
import { UserService } from '../../../Services/UserService';
import { Router } from '@angular/router';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, map, Observable, of } from 'rxjs';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import { UserDTO } from '../../../DTOs/User/UserDTO';
import { IApiResponse } from '../../../Interfaces/IApiResponse';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.css'
})
export class AddAdminComponent {

   isLoading: boolean = false;

  constructor(private userService: UserService, private router: Router){}
  
  userForm = new FormGroup({
    email : new FormControl('', [Validators.required, Validators.pattern(/[\w]{4,}[a-zA-Z0-9]{0,}\@(gmail)\.com$/)], [this.emailUniqueValidator()]), 
    name : new FormControl('', [Validators.required]), 
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[\dA-Za-z]{4,})(?=.*[_$@|/\\.&])[A-Za-z\d_$@|/\\.&]{8,}$/)]),
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


  registerAdmin(){

    if (this.userForm.status=="VALID") {

      showSweatAlert('question', 'Question', 'Are you sure with this data',true).then(res=>{
        if(res.isConfirmed){
          this.isLoading = true;
          let userDTO: UserDTO = {
            email: this.getEmail.value!,
            name: this.getName.value!,
            password: this.getPassword.value!,
            phoneNumber: this.getPhoneNumber.value!
          }
          
          this.userService.registerAdmin(userDTO).subscribe({
            next:(data: IApiResponse)=>{
              this.isLoading = false
              if(data.success){
                showSweatAlert('info', 'Info', 'Admin registered successfully').then(res=>{
                  this.userForm.reset();
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

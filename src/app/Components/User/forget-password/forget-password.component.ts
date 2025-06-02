import { UserService } from './../../../Services/UserService';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import { SendEmailDTO } from '../../../DTOs/User/SendEmailDTO';
import { error } from 'console';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {

  isEmailSent: boolean;
  public isLoading: boolean = false;
  constructor(private userService: UserService){
    this.isEmailSent = false;
  }

  FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required])
  })

  get getEmail(){
    return this.FormGroup.controls.email;
  }


  sendEmailToResetPassword(){

    if(this.FormGroup.status=="VALID"){

      this.isLoading = true;
      const sendEmailDTO: SendEmailDTO = {
        email: this.getEmail.value!,
      }
      this.userService.sendResetEmail(sendEmailDTO).subscribe({
        next: (ApiResponse)=>{
          if(ApiResponse.success){
            this.isEmailSent = true;
          }else{
            showSweatAlert('error', 'Send Reset Email', 'failed to send email')
            
          }
          this.isLoading = false;
        },
        error: (error)=>{
          showSweatAlert('error', 'Send Reset Email', 'internal server error')

        }
      })

    }else{
      this.FormGroup.markAllAsTouched();
    }
  

  }
  
}

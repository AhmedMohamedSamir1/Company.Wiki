import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../Services/UserService';
import { ResetPasswordDTO } from '../../../DTOs/User/ResetPasswordDTO';
import { showSweatAlert } from '../../../Shared/sweatAlert';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  isLoading = false;
constructor(private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router){

}

  resetPasswordForm = new FormGroup(
    {
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)
        
      ]),
      confirmPassword: new FormControl('', [Validators.required, this.matchPasswordValidator()] )
      
    },
    
  );

  get getNewPassword(){return this.resetPasswordForm.controls.newPassword}
  get getConfirmPassword(){return this.resetPasswordForm.controls.confirmPassword}


  matchPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent; // Access the parent form group
      if (!parent) {
        return null; // Parent not yet initialized
      }
      const newPassword = parent.get('newPassword')?.value;
      const confirmPassword = control.value;
      return newPassword === confirmPassword ? null : { "notIdentical": true }; 
    };
  }


  myCustomValidator(control: AbstractControl): ValidationErrors | null{

    try{
      if(control.value!=this.getNewPassword.value){
        return { 'notIdentical': { value: control.value } };
      }
      return null;
    }
    catch{

      return null;  // Validation passed
    }

  }


  resetPassword(){
    if (this.resetPasswordForm.status=="VALID") {
      const userId = this.activatedRoute.snapshot.queryParamMap.get('userId');
      const token = this.activatedRoute.snapshot.queryParamMap.get('token');

      const resetPasswordDTO: ResetPasswordDTO = {
        Token: token!,
        UserId: userId!,
        ConfirmPassword: this.getConfirmPassword.value!,
        NewPassword: this.getNewPassword.value!,
      }


      this.userService.resetPassword(resetPasswordDTO).subscribe({
        next: (IApiRes)=>{
          if(IApiRes.success){
            showSweatAlert('success', 'reset password', 'password is changed successfully').then((result)=>{
              if(result.isConfirmed|| result.dismiss){
                this.router.navigate(['/login'])
              }
            })
          }else{
            showSweatAlert('error', 'Error',IApiRes.message)
          }
        },
          error: (error)=>{ showSweatAlert('error', 'Error','Error while performing operation') }
      })

    }else
    {
      this.resetPasswordForm.markAllAsTouched();
    }
  }
}

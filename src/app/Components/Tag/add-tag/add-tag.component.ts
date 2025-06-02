import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { TagService } from '../../../Services/TagService';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import { TagDTO } from '../../../DTOs/Tag/TagDTO';
import { error } from 'console';
import { IApiResponse } from '../../../Interfaces/IApiResponse';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/AuthService';
import { RoleConst } from '../../../Constants/RoleConst';

@Component({
  selector: 'app-add-tag',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-tag.component.html',
  styleUrl: './add-tag.component.css'
})


export class AddTagComponent {

  constructor(private tagService: TagService, private router:Router){

  }

  tagForm = new FormGroup({
      name   : new FormControl('', [Validators.required], [this.emailUniqueValidator()])
  })

  get getName(){return this.tagForm.controls.name;}

  emailUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ tagTaken: boolean } | null> => {
        if (!control.value) 
          return of(null); // If no value is provided, skip validation
      
        return this.tagService.isTagNameUnique(control.value).pipe(
          map(isUnique => (isUnique.success ? null : { tagTaken: true })), 
          catchError(() => of(null)) // In case of an error, skip validation
        );
    };
  }


  addTag(){

    if(this.tagForm.status=="VALID") {
      showSweatAlert('question', 'adding new tag', 'do you wan to add this tag', true).then(result=>{
        if(result.isConfirmed){
          let tagDTO: TagDTO = {
            name: this.getName.value!,
          }
          this.tagService.addTag(tagDTO).subscribe({
            next: (data: IApiResponse)=>{
              if(data.success){
                showSweatAlert('success', 'Success', `the tag: ${this.getName.value} is added successfully`).then(res=>{
                  if(res.isConfirmed|| res.isDismissed){
                    this.tagForm.reset();
                    if(AuthService.isAdmin())
                      this.router.navigate(['/admin','tag'])
                    else if(AuthService.isUser())
                      this.router.navigate(['/user', 'tag'])
                  }
                })
              }else{
                showSweatAlert('error', 'Error', `error while adding new tag`)
              }
            },
            error: (error)=>{
              showSweatAlert('error', 'Error', `error while adding new tag`)
            }
          })
        }
      });
    }
    else{

      this.tagForm.markAllAsTouched();

      
    }
  }


}

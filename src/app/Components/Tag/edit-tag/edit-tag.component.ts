import { TagDTO } from './../../../DTOs/Tag/TagDTO';
import { ActivatedRoute, Route } from '@angular/router';
import { TagGetDTO } from './../../../DTOs/Tag/TagGetDTO';
import { TagService } from './../../../Services/TagService';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IApiResponse } from '../../../Interfaces/IApiResponse';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/AuthService';
import { RoleConst } from '../../../Constants/RoleConst';

@Component({
  selector: 'app-edit-tag',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-tag.component.html',
  styleUrl: './edit-tag.component.css'
})
export class EditTagComponent implements OnInit {

  tagId: number; // it get its value from URL
  tagGetDTO: TagGetDTO | null = null ;

  tagForm = new FormGroup({
    name   : new FormControl('', [Validators.required], [this.emailUniqueValidator()]), 
  })

  get getName(){return this.tagForm.controls.name;}

  constructor(private tagService: TagService, public activatedRoute: ActivatedRoute, private router: Router){
    this.tagId = this.activatedRoute.snapshot.params['id'];

  }

  ngOnInit(): void {
    this.tagService.getById(this.tagId).subscribe({
      next: (data: TagGetDTO)=>{this.tagGetDTO = data;  this.getName.setValue(this.tagGetDTO.name)},      
    })  
  }


  emailUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ tagTaken: boolean } | null> => {
        if (!control.value) 
          return of(null); // If no value is provided, skip validation
      
        return this.tagService.isTagNameUnique(control.value, this.tagGetDTO?.id).pipe(
          map(isUnique => (isUnique.success ? null : { tagTaken: true })),   // 'emailTaken' is used in --> hasError('emailTaken')
          catchError(() => of(null)) // In case of an error, skip validation
        );
    };
}


  editTag(){   
    if(this.tagForm.status=='VALID'){
      showSweatAlert('question', 'Edit Tag', 'do you want to save changes', true).then((result)=>{
        if(result.isConfirmed){

          let tagDTO: TagDTO = {
            name : this.getName.value!,
          }
    
          this.tagService.editTag(this.tagId, tagDTO).subscribe({
            next: (data: IApiResponse) => {
              if(data.success){
                showSweatAlert('success', 'Edit Tag', 'Tag Updated Successfully').then(result=>{
                  
                  if(result.isConfirmed|| result.isDismissed){
                    
                    if(AuthService.isAdmin())
                      this.router.navigate(['/admin','tag'])

                    if(AuthService.isUser())
                      this.router.navigate(['/user','tag'])
                  }
                })
              }
              else{
                showSweatAlert('error', 'Edit Tag', 'error when updating tag');
              }
            
            },
            error: (error)=>{showSweatAlert('error', 'Error', 'Error while performing operation')}
          })
        }
      })
      

    }else{
      this.tagForm.markAllAsTouched();
    }

    

   

  }


  
}

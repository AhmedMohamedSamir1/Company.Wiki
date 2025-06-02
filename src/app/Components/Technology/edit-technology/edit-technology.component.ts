import { AuthService } from './../../../Services/AuthService';
import { Component, OnInit } from '@angular/core';
import { TechnologyGetDTO } from '../../../DTOs/Technology/TechnologyGetDTO';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TechnologyService } from '../../../Services/TechnologyService';
import { ActivatedRoute, Router } from '@angular/router';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import { catchError, map, Observable, of } from 'rxjs';
import { TechnologyDTO } from '../../../DTOs/Technology/TechnologyDTO';
import { IApiResponse } from '../../../Interfaces/IApiResponse';
import { CommonModule } from '@angular/common';
import { RoleConst } from '../../../Constants/RoleConst';

@Component({
  selector: 'app-edit-technology',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-technology.component.html',
  styleUrl: './edit-technology.component.css'
})

export class EditTechnologyComponent implements OnInit {

  technologyId: number; // gets value from URL
  technologyGetDTO: TechnologyGetDTO | null = null;

  authService = AuthService;
  technologyForm = new FormGroup({
    name: new FormControl('', [Validators.required], [this.nameUniqueValidator()]),
  });

  get getName() { return this.technologyForm.controls.name; }

  constructor(
    private technologyService: TechnologyService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.technologyId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.technologyService.getById(this.technologyId).subscribe({
      next: (data: TechnologyGetDTO) => {
        this.technologyGetDTO = data;
        this.getName.setValue(this.technologyGetDTO.name);
      },
      error: () => {
        showSweatAlert('error', 'Error', 'Error fetching technology details');
      }
    });
  }

  nameUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ nameTaken: boolean } | null> => {
      if (!control.value) return of(null);

      return this.technologyService.isTechnologyNameUnique(control.value, this.technologyGetDTO?.id).pipe(
        map(isUnique => (isUnique.success ? null : { nameTaken: true })),
        catchError(() => of(null))
      );
    };
  }

  editTechnology() {
    if (this.technologyForm.status === 'VALID') {
      showSweatAlert('question', 'Edit Technology', 'Do you want to save changes?', true).then(result => {
        if (result.isConfirmed) {
          const technologyDTO: TechnologyDTO = {
            name: this.getName.value!,
          };

          this.technologyService.editTechnology(this.technologyId, technologyDTO).subscribe({
            next: (data: IApiResponse) => {
              if (data.success) {
                showSweatAlert('success', 'Edit Technology', 'Technology updated successfully').then(res => {
                  if (res.isConfirmed || res.isDismissed) {
                    if(AuthService.getUserClaims()?.role == RoleConst.Admin)
                      this.router.navigate(['/admin','technology'])
                    
                    if(AuthService.getUserClaims()?.role == RoleConst.User)
                      this.router.navigate(['/user','technology'])
                  }

                });
              } else {
                showSweatAlert('error', 'Edit Technology', 'Error when updating technology');
              }
            },
            error: () => {
              showSweatAlert('error', 'Error', 'Error while performing operation');
            }
          });
        }
      });
    } else {
      this.technologyForm.markAllAsTouched();
    }
  }
}

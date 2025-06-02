import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TechnologyService } from '../../../Services/TechnologyService';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import { TechnologyDTO } from '../../../DTOs/Technology/TechnologyDTO';
import { IApiResponse } from '../../../Interfaces/IApiResponse';
import { AuthService } from '../../../Services/AuthService';

@Component({
  selector: 'app-add-technology',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-technology.component.html',
  styleUrl: './add-technology.component.css'
})


export class AddTechnologyComponent {

  authService = AuthService;

  constructor(private technologyService: TechnologyService, private router: Router) {}

  technologyForm = new FormGroup({
      name: new FormControl('', [Validators.required], [this.technologyUniqueValidator()])
  });

  get getName() { return this.technologyForm.controls.name; }

  technologyUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ techTaken: boolean } | null> => {
      if (!control.value) 
        return of(null); // Skip validation if no value provided

      return this.technologyService.isTechnologyNameUnique(control.value).pipe(
        map(isUnique => (isUnique.success ? null : { techTaken: true })), 
        catchError(() => of(null)) // Skip validation in case of an error
      );
    };
  }

  addTechnology() {
    if (this.technologyForm.status === "VALID") {
      showSweatAlert('question', 'Adding new technology', 'Do you want to add this technology?', true).then(result => {
        if (result.isConfirmed) {
          let technologyDTO: TechnologyDTO = {
            name: this.getName.value!
          };

          this.technologyService.addTechnology(technologyDTO).subscribe({
            next: (data: IApiResponse) => {
              if (data.success) {
                showSweatAlert('success', 'Success', `The technology: ${this.getName.value} was added successfully`).then(res => {
                  if (res.isConfirmed || res.isDismissed) {
                    this.technologyForm.reset();
                    if(this.authService.isAdmin())
                      this.router.navigate(['/admin', 'technology']);

                    if(this.authService.isUser())
                      this.router.navigate(['/user', 'technology']);

                  }
                });
              } else {
                showSweatAlert('error', 'Error', 'Error while adding new technology');
              }
            },
            error: () => {
              showSweatAlert('error', 'Error', 'Error while adding new technology');
            }
          });
        }
      });
    } else {
      this.technologyForm.markAllAsTouched();
    }
  }
}
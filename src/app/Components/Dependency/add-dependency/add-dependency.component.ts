import { AuthService } from './../../../Services/AuthService';
import { Component } from '@angular/core';
import { DependencyService } from '../../../Services/DependencyService';
import { Router } from '@angular/router';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of, map, catchError } from 'rxjs';
import { DependencyDTO } from '../../../DTOs/Dependency/DependencyDTO';
import { IApiResponse } from '../../../Interfaces/IApiResponse';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-dependency',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-dependency.component.html',
  styleUrl: './add-dependency.component.css'
})

export class AddDependencyComponent {
  
  authService = AuthService;
  constructor(private dependencyService: DependencyService, private router: Router) {}

  dependencyForm = new FormGroup({
      name: new FormControl('', [Validators.required], [this.nameUniqueValidator()])
  });

  get getName() { return this.dependencyForm.controls.name; }

  nameUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ nameTaken: boolean } | null> => {
        if (!control.value) return of(null);
        return this.dependencyService.isDependencyNameUnique(control.value).pipe(
          map(isUnique => (isUnique.success ? null : { nameTaken: true })),
          catchError(() => of(null))
        );
    };
  }

  addDependency() {
    if (this.dependencyForm.status === 'VALID') {
      showSweatAlert('question', 'Add New Dependency', 'Do you want to add this dependency?', true).then(result => {
        if (result.isConfirmed) {
          const dependencyDTO: DependencyDTO = { name: this.getName.value! };
          this.dependencyService.addDependency(dependencyDTO).subscribe({
            next: (data: IApiResponse) => {
              if (data.success) {
                showSweatAlert('success', 'Success', `Dependency "${this.getName.value}" added successfully`).then(() => {
                  this.dependencyForm.reset();
                  if(this.authService.isAdmin())
                    this.router.navigate(['/admin', 'dependency']);
                  if(this.authService.isUser())
                    this.router.navigate(['/user', 'dependency']);
                });
              } else {
                showSweatAlert('error', 'Error', 'Error while adding dependency');
              }
            },
            error: () => showSweatAlert('error', 'Error', 'Error while adding dependency')
          });
        }
      });
    } else {
      this.dependencyForm.markAllAsTouched();
    }
  }
}
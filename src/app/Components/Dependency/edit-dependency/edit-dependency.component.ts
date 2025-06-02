import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, map, catchError } from 'rxjs';
import { DependencyDTO } from '../../../DTOs/Dependency/DependencyDTO';
import { IApiResponse } from '../../../Interfaces/IApiResponse';
import { DependencyService } from '../../../Services/DependencyService';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/AuthService';

@Component({
  selector: 'app-edit-dependency',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-dependency.component.html',
  styleUrl: './edit-dependency.component.css'
})

export class EditDependencyComponent implements OnInit {
  dependencyId: number;
  dependencyForm = new FormGroup({
    name: new FormControl('', [Validators.required], [this.nameUniqueValidator()])
  });

  constructor(private dependencyService: DependencyService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.dependencyId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.dependencyService.getById(this.dependencyId).subscribe({
      next: data => this.dependencyForm.controls.name.setValue(data.name),
      error: () => showSweatAlert('error', 'Error', 'Error while loading dependency')
    });
  }

  get getName() { return this.dependencyForm.controls.name; }

  nameUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ nameTaken: boolean } | null> => {
        if (!control.value) return of(null);
        return this.dependencyService.isDependencyNameUnique(control.value, this.dependencyId).pipe(
          map(isUnique => (isUnique.success ? null : { nameTaken: true })),
          catchError(() => of(null))
        );
    };
  }

  editDependency() {
    if (this.dependencyForm.status === 'VALID') {
      showSweatAlert('question', 'Edit Dependency', 'Do you want to save changes?', true).then(result => {
        if (result.isConfirmed) {
          const dependencyDTO: DependencyDTO = { name: this.getName.value! };
          this.dependencyService.editDependency(this.dependencyId, dependencyDTO).subscribe({
            next: (data: IApiResponse) => {
              if (data.success) {
                showSweatAlert('success', 'Success', 'Dependency updated successfully').then(() => {
                  if(AuthService.isAdmin())
                    this.router.navigate(['/admin', 'dependency']);
                  this.router.navigate(['/user', 'dependency']);
                });
              } else {
                showSweatAlert('error', 'Error', 'Error while updating dependency');
              }
            },
            error: () => showSweatAlert('error', 'Error', 'Error while updating dependency')
          });
        }
      });
    } else {
      this.dependencyForm.markAllAsTouched();
    }
  }
}
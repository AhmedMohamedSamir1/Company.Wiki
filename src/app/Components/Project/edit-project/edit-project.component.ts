import { TagGetDTO } from './../../../DTOs/Tag/TagGetDTO';
import { TechnologyGetDTO } from './../../../DTOs/Technology/TechnologyGetDTO';
import { ProjectGetDTO } from './../../../DTOs/Project/ProjectGetDTO';
import { IApiResponse } from './../../../Interfaces/IApiResponse';
import { ProjectDTO } from './../../../DTOs/Project/ProjectDTO';
import { ProjectService } from './../../../Services/ProjectService';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, Inject, OnInit, ViewEncapsulation, Input, OnChanges, SimpleChanges, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import TomSelect from 'tom-select';
import { TagService } from '../../../Services/TagService';
import { DependencyService } from '../../../Services/DependencyService';
import { TechnologyService } from '../../../Services/TechnologyService';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import { DependencyGetDTO } from '../../../DTOs/Dependency/DependencyGetDTO';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IUserClaims } from '../../../Interfaces/IUserClaims';
import { AuthService } from '../../../Services/AuthService';


@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css',
  encapsulation: ViewEncapsulation.None
})
export class EditProjectComponent implements AfterViewInit {

  projectId: number;
  ProjectGetDTO: ProjectGetDTO | null = null;

  allTags: TagGetDTO[] = [];
  allTechnologies: TechnologyGetDTO[] = [];
  allDependencies: DependencyGetDTO[] = [];

  allTagsSelect: TomSelect|undefined;
  allTechnologiesSelect: TomSelect|undefined;
  allDependenciesSelect: TomSelect|undefined;

  userClaims: IUserClaims | null = null;

  
  projectForm = new FormGroup({
    projectName: new FormControl('', [Validators.required], [this.projectUniqueValidator()]),
    projectTags: new FormControl('', [Validators.required]),
    projectTechnologies: new FormControl('', [Validators.required]),
    projectDependencies: new FormControl('', [Validators.required]),
    projectDescription: new FormControl('', [Validators.required]),
    projectLink: new FormControl('', [Validators.required]),
    projectInstructions: new FormControl('', [Validators.required]),

    projectWebsiteLink: new FormControl('',),
    projectBrand: new FormControl('',),
    projectClient: new FormControl('',),

  })

  get getProjectName() {
    return this.projectForm.controls.projectName;
  }
  
  get getProjectTags() {
    return this.projectForm.controls.projectTags;
  }
  
  get getProjectTechnologies() {
    return this.projectForm.controls.projectTechnologies;
  }
  
  get getProjectDependencies() {
    return this.projectForm.controls.projectDependencies;
  }
  
  get getProjectDescription() {
    return this.projectForm.controls.projectDescription;
  }
  
  get getProjectLink() {
    return this.projectForm.controls.projectLink;
  }
  
  get getProjectInstructions() {
    return this.projectForm.controls.projectInstructions;
  }
  
  get getProjectWebsiteLink() {
    return this.projectForm.controls.projectWebsiteLink;
  }
  
  get getProjectBrand() {
    return this.projectForm.controls.projectBrand;
  }
  
  get getProjectClient() {
    return this.projectForm.controls.projectClient;
  }


  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private tagService: TagService,
    private technologyService:TechnologyService,
    private dependencyService: DependencyService,
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    
    this.projectId = this.activatedRoute.snapshot.params['id'];

  }



  isPlatformIdRepresentsBrowserPlatform(): boolean{
    return isPlatformBrowser(this.platformId);
  }


  ngAfterViewInit() {
    if (this.isPlatformIdRepresentsBrowserPlatform()) {
      this.loadRequiredDataAndInitializeDropdowns();  
    }
  }
  

  loadRequiredDataAndInitializeDropdowns(){

  forkJoin({
    projectData: this.projectService.getById(this.projectId),
    tagsData: this.tagService.getAllTags(),
    technologiesData: this.technologyService.getAllTechnologies(),
    dependenciesData: this.dependencyService.getAllDependencies(),

    }).subscribe({
      next:({ projectData, tagsData, technologiesData, dependenciesData })=>{
        this.ProjectGetDTO = projectData.data; 
        this.allTags = tagsData; 
        this.allTechnologies = technologiesData;
        this.allDependencies = dependenciesData;

        this.getProjectName.setValue(this.ProjectGetDTO.name);
        this.getProjectLink.setValue(this.ProjectGetDTO.projectLink);
        this.getProjectName.setValue(this.ProjectGetDTO.name);
        this.getProjectInstructions.setValue(this.ProjectGetDTO.instructions);
        this.getProjectDescription.setValue(this.ProjectGetDTO.description);

        // [optional fields]
        this.getProjectBrand.setValue(this.ProjectGetDTO.brand);
        this.getProjectClient.setValue(this.ProjectGetDTO.client);
        this.getProjectWebsiteLink.setValue(this.ProjectGetDTO.websiteLink);

        this.initializeDropdowns();

      }
  })
}

  initializeDropdowns() {
    this.initializeTagsSelect();
    this.initializeTechnologiesSelect();
    this.initializeDependenciesSelect();
  }

  initializeTagsSelect() {
   this.allTagsSelect = new TomSelect('#select-tags', {
      placeholder: 'Select tags',
      plugins: ['caret_position', 'no_backspace_delete', 'remove_button'],
      
    createFilter: (optionTxt) => { 
      const options = Object.values(this.allTagsSelect!.options);
      for (let option of options) {
        if (option['text'].toLowerCase() === optionTxt.toLowerCase())
          return false;
      }
      return true;
    },

    create: (optionTxt) => {
        console.log("create() is called: " + optionTxt);
        this.createTag(optionTxt);
        return true; 
    },

      onItemAdd:()=>{ this.allTagsSelect?.setTextboxValue(''); }
    });
  
    // Populate dropdown options
    this.allTags.forEach(tag => {
      this.allTagsSelect?.addOption({ value: `${tag.id}`, text: `${tag.name}` });
    });

    // Set selected items  
    const tagsIds = this.ProjectGetDTO?.tags?.map(tag => String(tag.id)) || [];
    this.allTagsSelect?.addItems(tagsIds);

  }
  
 
  initializeTechnologiesSelect() {

    this.allTechnologiesSelect = new TomSelect('#select-technologies', {
      placeholder: 'Select technologies',
      plugins: ['caret_position', 'no_backspace_delete', 'remove_button'],

      createFilter: (optionTxt) => { 
        const options = Object.values(this.allTechnologiesSelect!.options);
        for (let option of options) {
          if (option['text'].toLowerCase() === optionTxt.toLowerCase())
            return false;
        }
        return true;
      },
  
      create: (optionTxt) => {
          console.log("create() is called: " + optionTxt);
          this.createTechnology(optionTxt);
          return true; 
      },

    });

    // Add options for technologies
    this.allTechnologies.forEach(technology => {
      this.allTechnologiesSelect?.addOption({ value: `${technology.id}`, text: `${technology.name}` });
    });


    const techIds = this.ProjectGetDTO?.technologies?.map(tech => String(tech.id)) || [];
    this.allTechnologiesSelect?.addItems(techIds);

  }

  initializeDependenciesSelect() {
   
      this.allDependenciesSelect = new TomSelect('#select-dependencies', {
        placeholder: 'Select dependencies',
        plugins: ['caret_position', 'no_backspace_delete', 'remove_button'],
        createFilter: (optionTxt) => { 
          const options = Object.values(this.allDependenciesSelect!.options);
          for (let option of options) {
            if (option['text'].toLowerCase() === optionTxt.toLowerCase())
              return false;
          }
          return true;
        },
    
        create: (optionTxt) => {
            console.log("create() is called: " + optionTxt);
            this.createDependency(optionTxt);
            return true; 
        },

      });

      // Add options for dependencies
      this.allDependencies.forEach(dependency => {
        this.allDependenciesSelect?.addOption({ value: `${dependency.id}`, text: `${dependency.name}` });
      });

      const dependenciesIds: string[] = this.ProjectGetDTO!.dependencies!.map(dep => String(dep.id));
      this.allDependenciesSelect?.addItems(dependenciesIds);
  }


  

  projectUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ nameTaken: boolean } | null> => {
        if (!control.value) 
          return of(null); // If no value is provided, skip validation
      
        return this.projectService.isProjectNameUnique(control.value, this.projectId).pipe(
          map(isUnique => (isUnique.success ? null : { nameTaken : true })),
          catchError(() => of(null)) // In case of an error, skip validation
        );
    };
  }



  editProject(){

    if(this.projectForm.status == 'VALID'){
      
      showSweatAlert('question', 'Question', 'do you want to save your changes', true).then(result=>{
        if(result.isConfirmed){

          let tags = this.convertToArrayOfNumber(this.allTagsSelect?.getValue());
          let dependencies = this.convertToArrayOfNumber(this.allDependenciesSelect?.getValue());
          let technologies = this.convertToArrayOfNumber(this.allTechnologiesSelect?.getValue());
          
          let projectDTO: ProjectDTO = {
            name: this.getProjectName.value!,
            description: this.getProjectDescription.value!,
            projectLink: this.getProjectLink.value!,
            instructions: this.getProjectInstructions.value!,
            tags: tags,
            dependencies: dependencies,
            technologies: technologies,
          
            brand: this.getProjectBrand.value,
            client: this.getProjectClient.value,
            websiteLink: this.getProjectWebsiteLink.value,
    
          } 

          this.projectService.editProject(this.projectId, projectDTO).subscribe({
            next: (data)=>{
              if(data.success){
                showSweatAlert('info', 'Info', 'project is updated successfully').then(result=>{
                  if(result.isConfirmed|| result.dismiss){
                    this.router.navigate(['/user', 'project']);
                  }
                })
               
              }else{
                showSweatAlert('error', 'Error', 'error while performing the operation');
              }
            },
            error: (error)=>{
              showSweatAlert('error', 'Error', 'internal server error');
              console.log(error);
            }
          })
        }

      })

    }else{
      this.projectForm.markAllAsTouched();
    }
  }


  convertToArrayOfNumber(input: string | string[] | undefined): number[] {

    if (Array.isArray(input)) {
      return input.map(Number); // If input is an array of strings, convert each item to a number
    } else if (typeof input === "string") {
     
      return [Number(input)];  // If input is a single string, convert it to a number and wrap in an array
    }
    // If input is undefined or null, return an empty array
    return [];
  }

  createTag(optionText: string){
    this.tagService.addTagAndReturn({name: optionText}).subscribe({
      next:(response)=>{
        if(response.success){
          this.allTagsSelect?.addOption({ value: `${ response.data.id}`, text: `${ response.data.name}` });
          this.allTagsSelect?.addItem(String(response.data.id));
        }

      },
      error:(error)=>{showSweatAlert("error","error","error");}
    })
  }
  
  createTechnology(optionText: string){
    this.technologyService.addAndReturn({name: optionText}).subscribe({
      next:(response)=>{
        if(response.success){
          this.allTechnologiesSelect?.addOption({ value: `${ response.data.id}`, text: `${ response.data.name}` });
          this.allTechnologiesSelect?.addItem(String(response.data.id));
        }

      },
      error:(error)=>{showSweatAlert("error","error","error");}
    })
  }

  createDependency(optionText: string){
    this.dependencyService.addAndReturn({name: optionText}).subscribe({
      next:(response)=>{
        if(response.success){
          this.allDependenciesSelect?.addOption({ value: `${ response.data.id}`, text: `${ response.data.name}` });
          this.allDependenciesSelect?.addItem(String(response.data.id));
        }

      },
      error:(error)=>{showSweatAlert("error","error","error");}
    })
  }



}
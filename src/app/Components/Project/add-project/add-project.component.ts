import { IApiResponse } from './../../../Interfaces/IApiResponse';
import { ProjectDTO } from './../../../DTOs/Project/ProjectDTO';
import { ProjectService } from './../../../Services/ProjectService';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import TomSelect from 'tom-select';
import { TagService } from '../../../Services/TagService';
import { TagGetDTO } from '../../../DTOs/Tag/TagGetDTO';
import { DependencyService } from '../../../Services/DependencyService';
import { TechnologyService } from '../../../Services/TechnologyService';
import { TechnologyGetDTO } from '../../../DTOs/Technology/TechnologyGetDTO';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import { DependencyGetDTO } from '../../../DTOs/Dependency/DependencyGetDTO';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { UserService } from '../../../Services/UserService';
import { ActivatedRoute, Route, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IUserClaims } from '../../../Interfaces/IUserClaims';
import { AuthService } from '../../../Services/AuthService';
import { error } from 'console';
import signalR, { HubConnectionState } from '@microsoft/signalr';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css',
  encapsulation: ViewEncapsulation.None
})


export class AddProjectComponent implements AfterViewInit, OnInit {

  allTags: TagGetDTO[] = [];
  allTechnologies: TechnologyGetDTO[] = [];
  allDependencies: DependencyGetDTO[] = [];
  notificationMessage: string | null = null;
  isLoading: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private tagService: TagService,
    private technologyService:TechnologyService,
    private dependencyService: DependencyService,
    private projectService: ProjectService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {  }
  
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadRequiredDataAndInitializeDropdowns()
    }
  }
  
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
  

  allTagsSelect: TomSelect|undefined;
  allTechnologiesSelect: TomSelect|undefined;
  allDependenciesSelect: TomSelect|undefined;

  loadRequiredDataAndInitializeDropdowns(){
    forkJoin({
      technologiesData: this.technologyService.getAllTechnologies(),
      tagsData: this.tagService.getAllTags(),
      dependenciesData: this.dependencyService.getAllDependencies()
    }).subscribe({
      next:({technologiesData, tagsData, dependenciesData})=>{
        this.allTags = tagsData;
        this.allTechnologies = technologiesData;
        this.allDependencies = dependenciesData;

        this.initializeDropdowns();

      }
    })
  }

  initializeDropdowns() {
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

      onItemAdd:()=>{ this.allTechnologiesSelect?.setTextboxValue(''); }

    });
  
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

      onItemAdd:()=>{ this.allDependenciesSelect?.setTextboxValue(''); }


    });
  
    this.allTags.forEach(tag => {
      this.allTagsSelect?.addOption({ value: `${tag.id}`, text: `${tag.name}` });
    });
  
    this.allTechnologies.forEach(technology => {
      this.allTechnologiesSelect?.addOption({ value: `${technology.id}`, text: `${technology.name}` });
    });
  
    this.allDependencies.forEach(dependency => {
      this.allDependenciesSelect?.addOption({ value: `${dependency.id}`, text: `${dependency.name}` });
    });
  }
  
  projectUniqueValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ nameTaken: boolean } | null> => {
        if (!control.value) 
          return of(null); // If no value is provided, skip validation
      
        return this.projectService.isProjectNameUnique(control.value).pipe(
          map(isUnique => (isUnique.success ? null : { nameTaken : true })),
          catchError(() => of(null)) // In case of an error, skip validation
        );
    };
  }

  addProject(){

    if(this.projectForm.status == 'VALID'){
      
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
       
        brand: this.getProjectBrand.value || null,
        client: this.getProjectClient.value || null,
        websiteLink: this.getProjectWebsiteLink.value|| null,

      }

      
      showSweatAlert('info', 'Add Project', 'are you sure ?', true).then(result=>{
        if(result.isConfirmed){
          this.isLoading = true;
          this.projectService.addProject(projectDTO).subscribe({
            next: (data: IApiResponse) => {
              if (data.success) {
                showSweatAlert('info', 'Add Project', 'Project is added successfully').then(res=>{
                  if(res.isConfirmed|| res.isDismissed){
                    if(AuthService.isAdmin())
                      this.router.navigate(['/admin','project']);
                    else if(AuthService.isAdmin())
                      this.router.navigate(['/user','project']);
                  }
                })
              }
              this.isLoading=false;
            },
            error: (error) => {
              console.error('Error Response:', error);
              showSweatAlert('error', 'Error', 'An error occurred while adding the project');
            }
          });
        }
      })


    }else{
      this.projectForm.markAllAsTouched();
      showSweatAlert('error', 'Error', 'Fill All Required fields');
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

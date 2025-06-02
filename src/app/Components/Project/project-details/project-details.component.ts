import { TechnologyService } from './../../../Services/TechnologyService';
import { TagService } from './../../../Services/TagService';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ProjectService } from '../../../Services/ProjectService';
import { ProjectGetDTO } from '../../../DTOs/Project/ProjectGetDTO';
import { DependencyService } from '../../../Services/DependencyService';
import TomSelect from 'tom-select';
import { AuthService } from '../../../Services/AuthService';
import { error } from 'console';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [RouterLink, ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class  ProjectDetailsComponent implements AfterViewInit, OnInit{

  projectId: number | null = null;
  ProjectGetDTO: ProjectGetDTO | null = null;
  TagsSelect: TomSelect|undefined;
  TechnologiesSelect: TomSelect|undefined;
  DependenciesSelect: TomSelect|undefined;
  auth = AuthService;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
   public activatedRoute: ActivatedRoute,
   private projectService: ProjectService,
   private router: Router
  ){

  }

  ngOnInit() {
    
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
      this.loadRequiredDataAndInitializeDropdowns();
    });
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
    this.projectService.getById(this.projectId!).subscribe({
      next: (data)=>{
        if(data.success){
          this.ProjectGetDTO = data.data;
          this.initializeDropdowns();
        }
        else if(!data.success){
          console.log(data);
          if(this.auth.isAdmin())
            this.router.navigate(['/admin','project']);
          this.router.navigate(['/user','project'])
        }         
        
      },
      error: (error)=>{
        console.log(error);
      }
    })
  }


  initializeDropdowns() {
    this.initializeTagsSelect();
    this.initializeTechnologiesSelect();
    this.initializeDependenciesSelect();
  }

    initializeTagsSelect() {

      if (this.TagsSelect) {
        this.TagsSelect.destroy();
      }

      this.TagsSelect = new TomSelect('#select-tags', {
        placeholder: 'Select tags',
        plugins: ['caret_position', 'no_backspace_delete', 'remove_button'],  
      });
    
      this.ProjectGetDTO?.tags.forEach(tag => {
        this.TagsSelect?.addOption({ value: `${tag.id}`, text: `${tag.name}` });
        this.TagsSelect?.addItems(String(tag.id));
      });

      this.TagsSelect.lock();
    }
    
   
    initializeTechnologiesSelect() {

      if (this.TechnologiesSelect) {
        this.TechnologiesSelect.destroy();
      }

      this.TechnologiesSelect = new TomSelect('#select-technologies', {
        placeholder: 'Select technologies',
        plugins: ['caret_position', 'no_backspace_delete', 'remove_button'],
      });
      this.ProjectGetDTO?.technologies.forEach(tech => {
        this.TechnologiesSelect?.addOption({ value: `${tech.id}`, text: `${tech.name}` });
        this.TechnologiesSelect?.addItems(String(tech.id));
      });

      this.TechnologiesSelect.lock();
    }
  
    initializeDependenciesSelect() {
     
      if (this.DependenciesSelect) {
        this.DependenciesSelect.destroy();
      }

        this.DependenciesSelect = new TomSelect('#select-dependencies', {
          placeholder: 'Select dependencies',
          plugins: ['caret_position', 'no_backspace_delete', 'remove_button'],
        });
  
        this.ProjectGetDTO?.dependencies.forEach(dep => {
          this.DependenciesSelect?.addOption({ value: `${dep.id}`, text: `${dep.name}` });
          this.DependenciesSelect?.addItems(String(dep.id));
        });

      this.DependenciesSelect.lock();

    }
  

}

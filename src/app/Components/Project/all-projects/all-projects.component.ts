import { PageParam } from './../../../DTOs/Pagination/PageParam';
import { SearchType } from './../../../Enums/SearchType';
import { ProjectService } from './../../../Services/ProjectService';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectGetDTO } from '../../../DTOs/Project/ProjectGetDTO';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import { error, log } from 'console';
import { debounce, forkJoin, Subject, debounceTime, switchMap, filter, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/AuthService';
import { PaginationSettingsConst } from '../../../Constants/PaginationSettingsConst';
import { RoleConst } from '../../../Constants/RoleConst';
import { PolicyNamesConst } from '../../../Constants/PolicyNamesConst ';
import { DependencyGetDTO } from '../../../DTOs/Dependency/DependencyGetDTO';
import { PagedListDTO } from '../../../DTOs/Pagination/PagedListDTO';
import { FromEnumToArrOfObject } from '../../../Shared/FromEnumTobject';
import { IEnum } from '../../../Interfaces/IEnum';
import { IApiResponse } from '../../../Interfaces/IApiResponse';
@Component({
  selector: 'app-all-projects',
  standalone: true,
  imports: [ RouterLink, RouterModule, CommonModule, FormsModule],
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.css'
})
export class AllProjectsComponent implements OnInit {

  
  pagedProjects: PagedListDTO<ProjectGetDTO> | null = null;
  searchText: string = "";
  searchType: SearchType = SearchType.Name;
  SearchTypes: IEnum[] = [];
  
  //----------- pagination variables ------------------
  
  
  pageProjects: ProjectGetDTO[] = [];
  count:number = 0;           // #search results
  currentPage: number = 1;    // current page
  pageNumbers: number[] = []; // array that has the paginations numbers
  totalPages: number = 0;     // #total pages

  authService = AuthService;
  
  constructor(private projectService: ProjectService){    
  }


  ngOnInit(): void {

    this.SearchTypes = FromEnumToArrOfObject(SearchType);
    this.getPagedList({
      PageNumber:1,
      SearchText: this.searchText,
      SearchType: this.searchType
    });

    
  }

  generatePageNumbers(): number[] { 
  
    const start = Math.max(1, Number(this.pagedProjects?.currentPage) - 2);
    const end = Math.min(Number(this.pagedProjects?.totalPages), Number(this.pagedProjects?.currentPage) + 2);

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  deleteProject(id: number, name: string){
   showSweatAlert('warning','Delete Tag', `do you want to delete the project [${name}]`, true).then(result=>{
        if(result.isConfirmed){
          this.projectService.deleteProject(id).subscribe({
            next:  (data: IApiResponse)=>   {
              if(data.success){
                this.getPagedList({PageNumber: this.pagedProjects?.currentPage, SearchText: this.searchText})
                showSweatAlert('success', ``, `tag deleted successfully`);
              }else{
                showSweatAlert('error', ``,`error while performing operation`);
              }
            },
            error: (error)=>  {},
          })
        }
      })
  }

  getByPage(pageNumber: number){
      
    const pageParam: PageParam = {
      PageNumber: pageNumber,
      SearchText: this.searchText,
      SearchType: this.searchType
    }
    this.getPagedList(pageParam);
  }


  getPagedList(pageParam: PageParam){
    console.log("getPagedList() is called");
        this.projectService.getPagedList(pageParam).subscribe({
          next:(data)=>{
            this.pagedProjects = data;
           
          },
          error: (error)=>{showSweatAlert('error', 'Error', `error while getting dependencies`)}
        })
  }

  
  applySearch(event: KeyboardEvent){

    if(event.key=== "Enter"){
      event.preventDefault();
      this.getPagedList({
        SearchText: this.searchText,
        PageNumber: 1,
        SearchType: this.searchType,
      })
    }
  }

  searchIconClick(){
    this.getPagedList({
      SearchText: this.searchText,
      PageNumber: this.pagedProjects?.currentPage,
      SearchType: this.searchType,
    })
  }

}

import { SearchType } from './../../../Enums/SearchType';
import { TechnologyService } from './../../../Services/TechnologyService';
import { DependencyGetDTO } from './../../../DTOs/Dependency/DependencyGetDTO';
import { Component, OnInit } from '@angular/core';
import { IApiResponse } from '../../../Interfaces/IApiResponse';
import { DependencyService } from '../../../Services/DependencyService';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/AuthService';
import { PolicyNamesConst } from '../../../Constants/PolicyNamesConst ';
import { RoleConst } from '../../../Constants/RoleConst';
import { PagedListDTO } from '../../../DTOs/Pagination/PagedListDTO';
import { PageParam } from '../../../DTOs/Pagination/PageParam';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-dependencies',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, FormsModule],
  templateUrl: './all-dependencies.component.html',
  styleUrl: './all-dependencies.component.css'
})

export class AllDependenciesComponent implements OnInit {

  allDependencies: DependencyGetDTO[] = [];
    addDependenciesPermission : boolean;
    deleteDependenciesPermission : boolean;
    editDependenciesPermission : boolean;
    authService = AuthService;

    pagedDependencies: PagedListDTO<DependencyGetDTO> | null = null;
    searchText: string = "";

  constructor(private dependencyService: DependencyService) {

    this.addDependenciesPermission = AuthService.hasPolicy(PolicyNamesConst.DependenciesAdd);
    this.deleteDependenciesPermission = AuthService.hasPolicy(PolicyNamesConst.DependenciesDelete);
    this.editDependenciesPermission = AuthService.hasPolicy(PolicyNamesConst.DependenciesEdit);

  }

  ngOnInit(): void {
    this.getPagedList({
      PageNumber: 1,
      SearchText: this.searchText
    });
  }



  deleteDependency(id: number, name: string) {
    showSweatAlert('warning', 'Delete Dependency', `Do you want to delete the dependency "${name}"?`, true).then(result => {
      if (result.isConfirmed) {
        this.dependencyService.deleteDependency(id).subscribe({
          next: (data: IApiResponse) => {
            if(data.success){
              this.getPagedList({PageNumber: this.pagedDependencies?.currentPage, SearchText: this.searchText})
              showSweatAlert('success', ``, `Dependency deleted successfully`);
            }else{
              showSweatAlert('error', ``,`error while performing operation`);
            }
          },
          error: () => showSweatAlert('error', 'Error', 'Error while deleting dependency')
        });
      }
    });
  }

  getByPage(pageNumber: number){
    
    const pageParam: PageParam = {
      PageNumber: pageNumber,
      SearchText: this.searchText
    }
    this.getPagedList(pageParam);
  }
  
    generatePageNumbers(): number[] { 
  
      const start = Math.max(1, Number(this.pagedDependencies?.currentPage) - 2);
      const end = Math.min(Number(this.pagedDependencies?.totalPages), Number(this.pagedDependencies?.currentPage) + 2);
  
      const pages: number[] = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    }
  
    getPagedList(pageParam: PageParam){
      this.dependencyService.getPagedList(pageParam).subscribe({
        next:(data)=>{
          this.pagedDependencies = data;
        },
        error: (error)=>{showSweatAlert('error', 'Error', `error while getting dependencies`)}
      })
    }
  
    applySearch(event: KeyboardEvent){
      if(event.key=== "Enter"){
        this.getPagedList({
          SearchText: this.searchText,
          PageNumber: 1,
        })
      }
    }
  
    searchIconClick(){
      this.getPagedList({
        SearchText: this.searchText,
        PageNumber: this.pagedDependencies?.currentPage
      })
    }

}

import { AuthService } from './../../../Services/AuthService';
import { TechnologyGetDTO } from './../../../DTOs/Technology/TechnologyGetDTO';
import { TechnologyService } from '../../../Services/TechnologyService';
import { Component, OnInit } from '@angular/core';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import { CommonModule } from '@angular/common';
import { IApiResponse } from '../../../Interfaces/IApiResponse';
import { RouterLink, RouterModule } from '@angular/router';
import { RoleConst } from '../../../Constants/RoleConst';
import { PolicyNamesConst } from '../../../Constants/PolicyNamesConst ';
import { PagedListDTO } from '../../../DTOs/Pagination/PagedListDTO';
import { PageParam } from '../../../DTOs/Pagination/PageParam';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-technologies',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, FormsModule],
  templateUrl: './all-technologies.component.html',
  styleUrl: './all-technologies.component.css'
})
export class AllTechnologiesComponent implements OnInit {

  allTechnologies: TechnologyGetDTO[] = [];

    
    pagedTechnologies: PagedListDTO<TechnologyGetDTO> | null = null;
    searchText: string = "";
    authService = AuthService;

  constructor(private technologyService: TechnologyService) {
  }

  ngOnInit(): void {
    this.getPagedList({
      PageNumber:1
    })
  }

  deleteTechnology(id: number, name: string) {
    showSweatAlert('warning', 'Delete Technology', `Do you want to delete the technology [${name}]?`, true).then(result => {
      if (result.isConfirmed) {
        this.technologyService.deleteTechnology(id).subscribe({
          next: (data: IApiResponse) => {
            if(data.success){
              this.getPagedList({PageNumber: this.pagedTechnologies?.currentPage, SearchText: this.searchText})
              showSweatAlert('success', ``, `technology deleted successfully`);
            }else{
              showSweatAlert('error', ``,`error while performing operation`);
            }
          },
          error: () => {
            showSweatAlert('error', 'Error', 'Error while deleting technology');
          }
        });
      }
    });
  }


  getPagedList(pageParam: PageParam){
  
      this.technologyService.getPagedList(pageParam).subscribe({
        next:(data)=>{
          this.pagedTechnologies = data;
        },
        error: (error)=>{showSweatAlert('error', 'Error', `error while getting data`)}
      })
  }

  applySearch(event: KeyboardEvent){
    if(event.key=== "Enter"){
      this.getPagedList({
        SearchText: this.searchText,
        PageNumber: 1
      })
    }
  }

  searchIconClick(){
    this.getPagedList({
      SearchText: this.searchText,
      PageNumber: this.pagedTechnologies?.currentPage
    })
  }


  generatePageNumbers(): number[] { 

    const start = Math.max(1, Number(this.pagedTechnologies?.currentPage) - 2);
    const end = Math.min(Number(this.pagedTechnologies?.totalPages), Number(this.pagedTechnologies?.currentPage) + 2);

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  
  getByPage(pageNumber: number){
    
    const pageParam: PageParam = {
      PageNumber: pageNumber,
      SearchText: this.searchText
    }
    this.getPagedList(pageParam);
  }

}

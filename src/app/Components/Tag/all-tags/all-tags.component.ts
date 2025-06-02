import { filter } from 'rxjs';
import { SearchType } from './../../../Enums/SearchType';
import { PageParam } from './../../../DTOs/Pagination/PageParam';
import { RoleConst } from './../../../Constants/RoleConst';
import { AuthService } from './../../../Services/AuthService';
import { Component, OnInit } from '@angular/core';
import { TagService } from '../../../Services/TagService';
import { TagGetDTO } from '../../../DTOs/Tag/TagGetDTO';
import { showSweatAlert } from '../../../Shared/sweatAlert';
import {  CommonModule, DatePipe } from '@angular/common';
import { IApiResponse } from '../../../Interfaces/IApiResponse';
import { RouterLink, RouterModule } from '@angular/router';
import { PolicyNamesConst } from '../../../Constants/PolicyNamesConst ';
import { error } from 'console';
import { PagedListDTO } from '../../../DTOs/Pagination/PagedListDTO';
import { subscribe } from 'diagnostics_channel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-tags',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, FormsModule],
  templateUrl: './all-tags.component.html',
  styleUrl: './all-tags.component.css'
})

export class AllTagComponent implements OnInit
{

  
  addTagsPermission : boolean;
  deleteTagsPermission : boolean;
  editTagsPermission : boolean;
  authService= AuthService;

  pagedTags: PagedListDTO<TagGetDTO> | null = null;
  searchText: string = "";
  
  constructor(private tagService: TagService,){
    this.addTagsPermission = AuthService.hasPolicy(PolicyNamesConst.TagsAdd);
    this.editTagsPermission = AuthService.hasPolicy(PolicyNamesConst.TagsEdit);
    this.deleteTagsPermission = AuthService.hasPolicy(PolicyNamesConst.TagsDelete);
    
  }

  ngOnInit(): void {

    this.getPagedList({
      PageNumber: 1,
      SearchText: this.searchText
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

    const start = Math.max(1, Number(this.pagedTags?.currentPage) - 2);
    const end = Math.min(Number(this.pagedTags?.totalPages), Number(this.pagedTags?.currentPage) + 2);

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getPagedList(pageParam: PageParam){
    this.tagService.getPagedList(pageParam).subscribe({
      next:(data)=>{
        this.pagedTags = data;
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
      PageNumber: this.pagedTags?.currentPage
    })
  }

  
  deleteTag(id:number, name: string){

    showSweatAlert('warning','Delete Tag', `do you want to delete the tag [${name}]`, true).then(result=>{
      if(result.isConfirmed){
        this.tagService.deleteTag(id).subscribe({
          next:  (data: IApiResponse)=>   {
            if(data.success){
              this.getPagedList({PageNumber: this.pagedTags?.currentPage, SearchText: this.searchText})
              showSweatAlert('success', ``, `tag deleted successfully`);
            }else{
              showSweatAlert('error', ``,`error while performing operation`);
              // this.getPaged
            }
          },
          error: (error)=>  {},
        })
      }
    })


  }

}



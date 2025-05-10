import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService, Project } from '../../Services/api.service';
import * as L from 'leaflet'; // Import Leaflet

declare var Dropbox: any;

@Component({
  selector: 'app-project-front-list',
  templateUrl: './project-front-list.component.html',
  styleUrl: './project-front-list.component.css',
})
export class ProjectFrontListComponent {
  projects: Project[] = [];
  searchQuery: string = '';
  sortColumn: string = '';

  isAscending: boolean = true;
  currentPage = 0;
  pageSize = 10;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(query: string = '', page: number = 0): void {
    this.apiService.getProjects(query, page).subscribe(
      (response: any) => {
        this.projects = response?.content ?? [];
        this.currentPage = page;
      },
      (error) => console.error('Error loading projects:', error)
    );
  }

  onSearchInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement?.value || '';
    this.fetchProjects(this.searchQuery);
  }

  sortProjects(column: string) {
    const isAscending = this.sortColumn === column ? !this.isAscending : true;
    this.sortColumn = column;
    this.isAscending = isAscending;

    this.projects.sort((a: any, b: any) => {
      if (a[column] < b[column]) return this.isAscending ? -1 : 1;
      if (a[column] > b[column]) return this.isAscending ? 1 : -1;
      return 0;
    });
  }
}

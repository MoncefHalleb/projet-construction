import {Component, ViewChild} from '@angular/core';
import {Sidebar} from "primeng/sidebar";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  // Property to track sidebar state
  public isSidebarOpen: boolean = true;


  constructor(private keycloakService: KeycloakService ) {}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    // Additional logic to adjust the UI as needed
  }
  logout()
  {
    this.keycloakService.logout();
  }

}

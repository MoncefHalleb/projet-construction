import { Component, Inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { UserServiceService } from '../Services/UserService/user-service.service';

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrl: './back.component.css'
})
export class BackComponent {
email: string = '';

  constructor(
    private keycloakService: KeycloakService,
    @Inject(UserServiceService) private userService: UserServiceService
  ) {}

  logout() {
    this.keycloakService.logout();
  }

  async ngOnInit(): Promise<void> {
    try {
      const userInfo = await this.userService.getCurrentUser();
      this.email = userInfo.email;
    } catch (error) {
      console.error('Error fetching predefined role:', error);
    }
  }
}

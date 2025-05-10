import { Component, Inject, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { HttpClient } from '@angular/common/http';
import { UserServiceService } from '../Services/UserService/user-service.service';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css'],
})
export class FrontComponent implements OnInit {
  email: string = '';
  profilePicUrl: string = 'assets/default-avatar.png';
  userProfile: any;

  constructor(
    private keycloakService: KeycloakService,
    private http: HttpClient,
    @Inject(UserServiceService) private userService: UserServiceService
  ) {}

  logout(): void {
    this.keycloakService.logout();
  }

  async ngOnInit(): Promise<void> {
    try {
      this.userProfile = await this.userService.getCurrentUser();
      this.email = this.userProfile?.email || '';

      if (this.email) {
        this.loadProfilePicture();
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }

  loadProfilePicture() {
    if (!this.userProfile?.email) return;
    this.http.get(`http://localhost:8088/api/service/user/getProfilePictureBlobByEmail/${this.userProfile.email}`, {
      responseType: 'text'
    }).subscribe({
      next: (imageBase64) => {
        this.profilePicUrl = imageBase64;
      },
      error: () => {
        console.warn("No profile image found.");
        this.profilePicUrl = 'assets/default-avatar.png'; // fallback avatar
      }
    });
  }

}

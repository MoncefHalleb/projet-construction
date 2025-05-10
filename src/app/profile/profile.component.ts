import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { KeycloakService } from 'keycloak-angular';
import { UserServiceService } from '../Services/UserService/user-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any = {};
  profilePicUrl: string = '';
  role: string = 'user';
  realm: string = 'Unknown';
  formattedCreationDate: string = 'N/A';
  lastLogin: string = 'N/A';
  username: string = '';
  loginHistory: any[] = [];

  constructor(
    private keycloakService: KeycloakService,
    private userService: UserServiceService,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    try {
      this.userProfile = await this.keycloakService.loadUserProfile();
      this.username = this.userProfile.username;

      const keycloakInstance = this.keycloakService.getKeycloakInstance();
      const token = keycloakInstance.tokenParsed;

      if (token) {
        const roles = token.realm_access?.roles || [];
        this.role = roles.includes('admin') ? 'admin' : 'user';
        this.realm = token.iss ? (new URL(token.iss).pathname.split('/').pop() || 'Unknown') : 'Unknown';
        this.formattedCreationDate = token['created'] ? new Date(token['created'] * 1000).toLocaleString() : 'N/A';
        this.lastLogin = token.auth_time ? new Date(token.auth_time * 1000).toLocaleString() : 'N/A';
      }

      this.loadLoginHistory(this.username);
      this.loadProfilePicture();
    } catch (error) {
      console.error("🚨 Error loading user profile:", error);
      this.toastr.error('Failed to load profile data', 'Error');
    }
  }

  loadLoginHistory(username: string) {
    this.userService.getUserLoginHistory(username).subscribe({
      next: (logins) => {
        this.loginHistory = (logins || [])
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5)
          .map(event => ({
            timestamp: event.timestamp,
            ip: event.ip,
            device: event.device || 'Unknown Device',
            location: event.location || 'Unknown Location',
            details: event.details
          }));
      },
      error: err => {
        console.error("❌ Failed to load login history:", err);
      }
    });
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file: File | null = input.files?.[0] || null;
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.http.post(`http://localhost:8088/api/service/user/uploadProfilePictureAsBlobByEmail/${this.userProfile.email}`, formData)
      .subscribe({
        next: () => {
          this.toastr.success('Profile picture uploaded successfully!');
          this.loadProfilePicture(); // 🔄 refresh image
        },
        error: (err) => {
          console.error('❌ Upload failed:', err);
          this.toastr.error('Failed to upload image', 'Error');
        }
      });
  }

  updateUser() {
    this.router.navigate(['/user/updateprofile', this.userProfile.email]);
  }

  logout() {
    this.keycloakService.logout();
  }
}

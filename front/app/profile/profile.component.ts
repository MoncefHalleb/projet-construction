import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { User } from '../Modules/UserModule/User';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any;
  role: string = '';
  realm: string = '';
  formattedCreationDate: string = '';
  lastLogin: string = '';

  constructor(private keycloakService: KeycloakService ,
    private router: Router,
        private route: ActivatedRoute,
        private toastr: ToastrService
  ) {}

  async ngOnInit() {
    try {
      this.userProfile = await this.keycloakService.loadUserProfile();
      
      // Get the Keycloak instance and parsed token
      const keycloakInstance = this.keycloakService.getKeycloakInstance();
      const token = keycloakInstance.tokenParsed;

      if (token) {
        this.role = token.realm_access?.roles.includes('admin') ? 'admin' : 'user';

        if (token['created']) {
          this.formattedCreationDate = new Date(token['created'] * 1000).toLocaleString();
        }
        if (token.auth_time) {
          this.lastLogin = new Date(token.auth_time * 1000).toLocaleString();
        }
      }
    } catch (error) {
      console.error('Failed to load user profile', error);
    }

  }

  updateUser(user: User) {
    this.router.navigate(['/user/updateprofile', user.email]);
  }
  logout() {
    this.keycloakService.logout();
  }
}

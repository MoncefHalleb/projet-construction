import { Component, Inject, OnInit } from '@angular/core';
import { KeycloakService } from "keycloak-angular";
import { Router } from "@angular/router";
import { UserServiceService } from '../Services/UserService/user-service.service'; // Ensure correct import

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private keycloak: KeycloakService, 
    private router: Router, 
    @Inject(UserServiceService) private userService: UserServiceService // ✅ Ensure injection works
  ) {}

  async ngOnInit(): Promise<void> {
    if (await this.keycloak.isLoggedIn()) {
      console.log('✅ Logged in');

      try {
        const predefinedRole = await this.userService.getPredefinedRole();

        if (predefinedRole === 'admin') {
          console.log('🚀 Redirecting to admin dashboard');
          this.router.navigate(['/admins']);
        } else if (predefinedRole === 'user') {
          console.log('🚀 Redirecting to user dashboard');
          this.router.navigate(['/user']);
        } else {
          console.warn('⚠ No valid role found, redirecting to login.');
          this.router.navigate(['/login']);
        }
      } catch (error) {
        console.error("❌ Error retrieving user role:", error);
        this.router.navigate(['/login']);
      }

    } else {
      console.log('🔴 Not logged in, initiating login...');
      this.login();
    }
  }

  login() {
    this.keycloak.login();
  }
}

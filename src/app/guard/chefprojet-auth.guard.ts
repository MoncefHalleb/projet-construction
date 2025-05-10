import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserServiceService } from '../Services/UserService/user-service.service';


@Injectable({
  providedIn: 'root',
})
export class chefprojetAuthGuard implements CanActivate {
  constructor(private userService: UserServiceService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      const predefinedRole = await this.userService.getPredefinedRole();
      if (predefinedRole === 'chef_projet') {
        return true;
      } else {
        this.router.navigate(['/login']); // Redirect if not admin
        return false;
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      this.router.navigate(['/login']); // Redirect to login if error occurs
      return false;
    }
  }
}

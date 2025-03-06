import { Component, OnInit } from '@angular/core';
import { UserServiceService } from "../../../Services/UserService/user-service.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-profile-back',
  templateUrl: './profile-back.component.html',
  styleUrls: ['./profile-back.component.css']
})
export class ProfileBackComponent implements OnInit {

  user: any = {};
  username: string = '';
  email: string = '';
  role: string = '';
image_url: string ='';
  constructor(
    private userService: UserServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.userService.getCurrentUser()
      .then(userInfo => {
        console.log('User Info:', userInfo);

        this.username = userInfo.preferred_username;
        this.email = userInfo.email;

        // ✅ Get roles from UserServiceService (not AuthGuard)
        const roles = this.userService.getPredefinedRole();
        console.log("Roles from UserServiceService:", roles);

        // ✅ Assign role properly (prioritize `admin`)
        this.role = roles.includes("admin") ? "admin" : (roles.includes("user") ? "user" : "No valid role");
      })
      .catch(error => {
        console.error("Failed to load user information:", error);
      });
  }
  
}

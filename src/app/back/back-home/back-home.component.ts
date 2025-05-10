import { Component, OnInit } from '@angular/core';
import { UserServiceService } from "../../Services/UserService/user-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import { User, UserWrapper } from "../../Modules/UserModule/User";
import { ToastrService } from "ngx-toastr";
import { ApiResponse } from '../../Modules/UserModule/ApiResponse';

@Component({
  selector: 'app-back-home',
  templateUrl: './back-home.component.html',
  styleUrls: ['./back-home.component.css']
})
export class BackHomeComponent implements OnInit {
  message: string = '';
  username: string = '';
  welcome: string = "Welcome to the back office";
  userList: User[] = [];
  email: string = '';
  idUser: number = 0;
  sidebarExpanded = true;

  constructor(
    private UserService: UserServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.UserService.getUsers().subscribe(users => {
      this.userList = users;
    });
    this.getCurrentUser();
    this.registerAllUsersFromKeycloak(); // 🔥 Auto-register all users

  }

  async getCurrentUser() {
    try {
      const userInfo = await this.UserService.getCurrentUser();
      this.username = userInfo.preferred_username;
      this.email = userInfo.email;

      console.log("🔍 Fetching user by login:", this.username);

      this.UserService.getUserByLogin(this.username).subscribe(
        userWrapper => {
          if (userWrapper && userWrapper.data && userWrapper.data.user) {
            this.idUser = userWrapper.data.user.id_User;
            console.log("✅ User found in DB:", userWrapper.data.user);
          } else {
            console.warn("⚠ User not found in DB, registering from Keycloak...");
          }
        },
        error => {
          console.error("❌ Error fetching user from database:", error);
          console.warn("⚠ User not found in DB, registering from Keycloak...");
        }
      );
    } catch (error) {
      console.error("🚨 Error getting Keycloak user info:", error);
    }
  }
  registerAllUsersFromKeycloak() {
    console.log("🔍 Registering all users from Keycloak...");
  
    this.UserService.createUser().subscribe(
      (response) => {
        console.log("✅ All Keycloak users successfully registered:", response);
        this.toastr.success("All Keycloak users registered successfully!", "Success");
      },
      (error) => {
        console.error("❌ Error registering users from Keycloak:", error);
        this.toastr.error("Failed to register users from Keycloak", "Error");
      }
    );
  }
  
 

  updateUser(user: User) {
    this.router.navigate(['/admins/update', user.email]);
  }

  deleteUser(user: User) {
    console.log("🗑 Deleting user with login:", user.login);

    if (!user.login) {
      console.error("❌ Error: User login is missing.");
      this.toastr.error("User login is missing", 'Error');
      return;
    }

    this.UserService.deleteUser(user.login).subscribe(
      response => {
        if (response.success) {
          console.log("✅ User deleted:", response.message);
          this.toastr.success(response.message, 'Success');
          
          // Refresh user list
          this.UserService.getUsers().subscribe(users => {
            this.userList = users;
          });
        } else {
          console.error("❌ Error deleting user:", response.message);
          this.toastr.error(response.message, 'Error');
        }
      },
      error => {
        console.error("❌ HTTP Error:", error);
        this.toastr.error("Error occurred while deleting user", 'Error');
      }
    );
  }
}

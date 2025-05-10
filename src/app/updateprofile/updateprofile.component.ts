import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { KeycloakService } from "keycloak-angular";
import { UserServiceService } from '../Services/UserService/user-service.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  userForm: FormGroup;
  email: string = '';
  userId: number = 0;

  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private router: Router,
    private toastr: ToastrService,
    private keycloakService: KeycloakService
  ) {
    this.userForm = this.fb.group({});
  }

  async ngOnInit() {
    this.userForm = this.fb.group({
      login: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      firstName: [''],
      lastName: ['']
    });

    const profile = await this.keycloakService.loadUserProfile();
    this.email = profile.email || '';

    this.userService.getUserByEmail(this.email).subscribe(response => {
      if (response?.success && response?.data?.user) {
        const user = response.data.user;
        this.userId = user.id_User;

        this.userForm.patchValue({
          login: user.login || '',
          email: user.email || '',
          firstName: user.firstName || '',
          lastName: user.lastName || ''
        });
      } else {
        this.toastr.error("User data could not be loaded.");
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const updatedUser = {
        ...this.userForm.getRawValue(),
        id_User: this.userId
      };

      this.userService.updateUser(updatedUser, updatedUser.firstName, updatedUser.lastName, updatedUser.lastName).subscribe({
        next: (response) => {
          if (response?.success) {
            this.toastr.success("Profile updated successfully!");
            this.router.navigate(['/user/profile']);
          } else {
            this.toastr.error("Failed to update profile.");
          }
        },
        error: () => {
          this.toastr.error("An error occurred while updating your profile.");
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/user/profile']);
  }
}

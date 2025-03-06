import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import { UserWrapper, User } from '../Modules/UserModule/User';
import { UserServiceService } from '../Services/UserService/user-service.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './updateprofile.component.html',
  styleUrl: './updateprofile.component.css'
})
export class UpdateprofileComponent implements OnInit{
  message: string = "";
  Id_user: number = 0 ;
  private email: any;
  role: string = '';

  private UserWrapper: any = {} as UserWrapper;
  userForm: FormGroup;
  showRoleEntrepriseFields = false;
  showEtudiantFields = false;

  constructor(private activeRoute: ActivatedRoute,
              private UserService: UserServiceService,
              private router: Router ,
              private fb: FormBuilder,
              private toastr: ToastrService) {
    this.userForm = this.fb.group({});

  }
  ngOnInit(): void {
    this.userForm = this.fb.group({
      login: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      role: ['', Validators.required],
      role_entreprise: [''],
      identifiant: [''],
      classe: [''],
      specialite: ['']
    });
    this.email = this.activeRoute.snapshot.params['email'];
    this.UserService.getUserByEmail(this.email).subscribe(response => {
      console.log("✅ API Response:", response);
    
      if (response?.success && response?.data?.user) {
        this.UserWrapper = response.data;  // ✅ Extract data correctly
        this.Id_user = this.UserWrapper.user.id_User;
    
        this.userForm.patchValue({
          login: this.UserWrapper.user.login ?? '',
          email: this.UserWrapper.user.email ?? '',
          firstName: this.UserWrapper.user.firstName ?? '',
          lastName: this.UserWrapper.user.lastName ?? '',
          role: this.UserWrapper.user.role ?? '',
          role_entreprise: this.UserWrapper.user.role_entreprise ?? '',
          identifiant: this.UserWrapper.user.identifiant ?? '',
          classe: this.UserWrapper.user.classe ?? '',
          specialite: this.UserWrapper.user.specialite ?? '',
        });
    
        console.log("✅ Form populated with user data:", this.userForm.value);
      } else {
        console.error("❌ User data not found in response!");
      }
    });
  }    

  onSubmit() {
    if (this.userForm.valid) {
      let u: User = this.userForm.value;
      u.id_User = this.Id_user; // Ensure ID is set
  
      console.log("📤 Sending Update Request:", u);
  
      this.UserService.updateUser(u, u.firstName, u.lastName, u.lastName).subscribe(
        response => {
          console.log("✅ Update Response:", response);
        },
        error => {
          console.error("❌ Update Failed:", error);
        }
      );
    }
  }
  

  toggleFields(role: string): void {
    this.showRoleEntrepriseFields = role === 'Agententreprise';
    this.showEtudiantFields = role === 'etudiant';
  }

}

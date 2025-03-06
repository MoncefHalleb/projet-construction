import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserServiceService} from "../../../Services/UserService/user-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../Modules/UserModule/User";
import {ToastrService} from 'ngx-toastr';
import {ApiResponse} from "../../../Modules/UserModule/ApiResponse";

@Component({
  selector: 'app-user-management-component',
  templateUrl: './user-management-component.component.html',
  styleUrl: './user-management-component.component.css'
})
export class UserManagementComponentComponent implements OnInit, AfterViewInit {

  message: string = "";
  userForm: FormGroup;
  showRoleEntrepriseFields = false;
  showEtudiantFields = false;
  response: ApiResponse<any> | null = null;

  constructor(private UserService: UserServiceService,
              private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private toastr: ToastrService) {
    this.userForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      login: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      role: ['', Validators.required],
      role_entreprise: [''],
      identifiant: [''],
      classe: [''],
      specialite: ['']
    });

    // Subscribe to role control value changes
    // @ts-ignore
    this.userForm.get('role').valueChanges.subscribe(value => {
      this.toggleFields(value);
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      // Handle form submission
      let u: User = this.userForm.value;

      this.UserService.adduser(u, this.userForm.value.password, this.userForm.value.role, this.userForm.value.firstName, this.userForm.value.lastName).subscribe(
        response => {
          if (response.success) {
            console.log(response.message);
            this.message = response.message;
            this.toastr.success(response.message, 'Success');
          } else {
            console.log(response.message);
            this.message = response.message;
            this.toastr.error(response.message, 'Error');
          }
        }
      );
    }
    this.userForm.reset();
  }

  ngAfterViewInit(): void {
    // Check if response is available and display toast if necessary
    if (this.response) {
      if (this.response.success) {
        this.toastr.success(this.response.message, 'Success');
      } else {
        this.toastr.error(this.response.message, 'Error');
      }
    }
  }

  toggleFields(role: string): void {
    this.showRoleEntrepriseFields = role === 'Agententreprise';
    this.showEtudiantFields = role === 'etudiant';
  }


}

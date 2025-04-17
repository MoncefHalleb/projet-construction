import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
  signUpForm: FormGroup;
  step: number = 1;
  selectedRole: string = '';

  @ViewChild('signUpButton') signUpButton!: ElementRef;
  @ViewChild('signInButton') signInButton!: ElementRef;
  @ViewChild('container') container!: ElementRef;
  passwordFieldType: string = 'password';

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      gender: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
      phoneNumber: [''],
      email: ['', [Validators.required, Validators.email]],
      levelOfStudy: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      companyName: [''],
      companyIdentifier: [''],
      industrySector: [''],
      companyAddress: [''],
      contactNumber: [''],
    });
    // Add conditional validation based on role
    this.signUpForm.get('role')?.valueChanges.subscribe((role) => {
      if (role === 'rh') {
        this.signUpForm
          .get('companyName')
          ?.setValidators([Validators.required]);
        this.signUpForm
          .get('companyIdentifier')
          ?.setValidators([Validators.required]);
        this.signUpForm
          .get('industrySector')
          ?.setValidators([Validators.required]);
        this.signUpForm
          .get('companyAddress')
          ?.setValidators([Validators.required]);
        this.signUpForm
          .get('contactNumber')
          ?.setValidators([Validators.required]);
      } else {
        this.signUpForm.get('companyName')?.clearValidators();
        this.signUpForm.get('companyIdentifier')?.clearValidators();
        this.signUpForm.get('industrySector')?.clearValidators();
        this.signUpForm.get('companyAddress')?.clearValidators();
        this.signUpForm.get('contactNumber')?.clearValidators();
      }

      // Update the validity of the form controls
      this.signUpForm.get('companyName')?.updateValueAndValidity();
      this.signUpForm.get('companyIdentifier')?.updateValueAndValidity();
      this.signUpForm.get('industrySector')?.updateValueAndValidity();
      this.signUpForm.get('companyAddress')?.updateValueAndValidity();
      this.signUpForm.get('contactNumber')?.updateValueAndValidity();
    });
  }

  ngAfterViewInit() {
    this.signUpButton.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.add('right-panel-active');
    });

    this.signInButton.nativeElement.addEventListener('click', () => {
      this.container.nativeElement.classList.remove('right-panel-active');
    });
  }

  togglePasswordVisibility() {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onRoleChange(event: any) {
    this.selectedRole = event.target.value;
  }
  // Check if Step 1 is valid
  isStep1Valid(): boolean {
    return (
      !!this.signUpForm.get('gender')?.valid &&
      !!this.signUpForm.get('firstName')?.valid &&
      !!this.signUpForm.get('lastName')?.valid &&
      !!this.signUpForm.get('role')?.valid
    );
  }

  nextStep() {
    if (this.isStep1Valid()) {
      this.step = 2;
      this.cdRef.detectChanges(); // Manually trigger change detection
    } else {
      this.signUpForm.markAllAsTouched(); // Mark all fields as touched
    }
  }
  previousStep() {
    // Reset to the first step and clear any changes
    this.step = 1;
    this.signUpForm.markAsUntouched(); // Mark the form as untouched
    this.signUpForm.markAsPristine(); // Mark the form as pristine
    this.cdRef.detectChanges(); // Manually trigger change detection

    // Optionally, you can reset specific form controls as well
    this.signUpForm.controls['firstName'].reset();
    this.signUpForm.controls['lastName'].reset();
  }
  //sign UP
  onSubmit() {}
  //Login
  onLogin(form: NgForm) {}
}

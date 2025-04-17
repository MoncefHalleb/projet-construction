import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  standalone: false,

  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = ''; // To display error messages

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    // Initialize the login form with validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() { return this.loginForm.controls; }

  // Method to handle login form submission
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials = this.loginForm.value;

    this.userService.login(credentials).subscribe(
      (response) => {
        console.log('Login successful:', response);
        // Redirect to a dashboard or another page after successful login
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service'; // Adjust path to your UserService
import { User } from '../models/user.model'; // Adjust path to your User model

@Component({
  standalone: false,

  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup; // Reactive form for registration

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService // Inject the UserService
  ) {
    // Initialize the form with validation
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$')
      ]],
      role: ['STUDENT']
    });
  }

  get f() { return this.registerForm.controls; }

  ngOnInit(): void { }

  // Method to handle form submission
  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const formData: User = this.registerForm.value;
    // Call the register method from the UserService
    this.userService.register(formData).subscribe(
      () => {
        console.log('User registered successfully:', formData);
        this.router.navigate(['/login']);
      },
      (error: any) => {
        console.error('Error registering user:', error);
      }
    );
  }
}

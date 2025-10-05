import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth-service';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss'
})
export class LoginForm {
  private readonly router: Router;
  private readonly authService: AuthService;
  formGroup: FormGroup;

  constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
    this.formGroup = new FormGroup(
      {
        username: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      }
    );
  }

  login() {
    if (this.formGroup.valid) {
      const auth = this.formGroup.value;
      this.authService.login(auth);
   }
  }
}

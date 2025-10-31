import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CredentialsFrom } from '../../../shared/models/auth';
import { AuthService } from '../../../shared/services/auth/auth-service';

type AuthFormGroup = FormGroup<{
  username: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss'
})
export class LoginForm {
  private readonly authService: AuthService;
  private readonly formGroup: AuthFormGroup;

  constructor(authService: AuthService) {
    this.authService = authService;
    this.formGroup = new FormGroup({
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      })
    });
  }

  form(): FormGroup {
    return this.formGroup;
  }

  login(): void {
    if (this.formGroup.valid) {
      const credentials = new CredentialsFrom(this.formGroup.getRawValue());
      this.authService.login(credentials);
    }
  }
}

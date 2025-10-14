import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth-service';
import { CredentialsFrom } from '../../../shared/models/auth';

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
      username: new FormControl(
        '',
        { nonNullable: true, validators: [Validators.required] }
      ),
      password: new FormControl(
        '',
        { nonNullable: true, validators: [Validators.required] }
      )
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

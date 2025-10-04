import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth/auth-service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss'
})
export class LoginForm {
  formGroup: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.formGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  login() {
    if (this.formGroup.valid) {
      const data = this.formGroup.value;
      this.authService.login(data)
   }
  }
}

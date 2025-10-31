import { Component } from '@angular/core';
import { LoginForm } from '../login-form/login-form';

@Component({
  selector: 'app-login-template',
  imports: [LoginForm],
  templateUrl: './login-template.html',
  styleUrl: './login-template.scss'
})
export class LoginTemplate {}

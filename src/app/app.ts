import { Component, signal } from '@angular/core';
import { LoginTemplate } from "./pages/auth/login-template/login-template";

@Component({
  selector: 'app-root',
  imports: [LoginTemplate],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('system-bank');
}

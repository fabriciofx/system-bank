import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { CommonModule } from '@angular/common';
import { Navbar } from './shared/components/navbar/navbar';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router: Router;
  protected readonly title = signal('system-bank');
  showNavbar = true;

  constructor(router: Router) {
    this.router = router;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavbar = event.url !== '/' && event.url !== '/auth';
    });
  }
}

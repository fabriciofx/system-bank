import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { Navbar } from './shared/components/navbar/navbar';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router: Router;
  private readonly showNavbar: boolean[];
  protected readonly title = signal('system-bank');

  constructor(router: Router) {
    this.router = router;
    this.showNavbar = [];
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      while (this.showNavbar.length > 0) {
        this.showNavbar.pop();
      }
      this.showNavbar.push(event.url !== '/' && event.url !== '/auth');
    });
  }

  navbar(): boolean {
    return this.showNavbar.at(0) || false;
  }
}

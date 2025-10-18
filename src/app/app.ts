import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { Navbar } from './shared/components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [
    Navbar,
    RouterModule
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router: Router;
  private readonly url: WritableSignal<string>;
  private readonly navbar: Signal<boolean>;

  constructor(router: Router) {
    this.router = router;
    this.url = signal<string>('');
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.url.set(event.urlAfterRedirects);
      });
    this.navbar = computed(() => !this.url().endsWith('/auth'));
  }

  showNavbar(): boolean {
    return this.navbar();
  }
}

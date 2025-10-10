import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatNavList } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    MatSidenavModule,
    MatNavList,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router: Router;
  private readonly url: WritableSignal<string>;
  private readonly navbar: Signal<boolean>;
  private readonly opened: WritableSignal<boolean>;

  constructor(router: Router) {
    this.router = router;
    this.url = signal<string>('');
    this.opened = signal<boolean>(false);
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

  menuOpened(): boolean {
    return this.opened();
  }

  onOpenedChange(event: boolean): void {
    this.opened.set(event);
  }
}

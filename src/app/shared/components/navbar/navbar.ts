import { Component, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatNavList } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterModule,
    MatSidenavModule,
    MatNavList,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private readonly opened: WritableSignal<boolean>;

  constructor() {
    this.opened = signal<boolean>(false);
  }

  menuOpened(): boolean {
    return this.opened();
  }

  onOpenedChange(event: boolean): void {
    this.opened.set(event);
  }
}

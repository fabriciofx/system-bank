import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatNavList } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [MatSidenavModule, MatNavList, MatToolbarModule, MatIconModule, RouterOutlet],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  opened = false;
}

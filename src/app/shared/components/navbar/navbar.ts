import { Component, signal, WritableSignal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatNavList } from "@angular/material/list";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { YesNoMessage } from '../../custom/message';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterModule,
    MatSidenavModule,
    MatNavList,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private readonly opened: WritableSignal<boolean>;
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
    this.opened = signal<boolean>(false);
  }

  menuOpened(): boolean {
    return this.opened();
  }

  onOpenedChange(event: boolean): void {
    this.opened.set(event);
  }

  async logout(): Promise<void> {
    const answer = await new YesNoMessage(
      'Você deseja sair do sistema?',
      'Se sim, você será redirecionado para a tela de login.'
    ).show()
    if (answer.yes()) {
      this.authService.logout();
    }
  }
}

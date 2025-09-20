import { Component, signal } from '@angular/core';
import { CadastroCliente } from './pages/cliente/cadastro-cliente/cadastro-cliente';

@Component({
  selector: 'app-root',
  imports: [CadastroCliente],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('system-bank');
}

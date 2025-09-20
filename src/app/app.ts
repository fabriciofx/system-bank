import { Component, signal } from '@angular/core';
import { ListagemCliente } from './pages/cliente/listagem-cliente/listagem-cliente';

@Component({
  selector: 'app-root',
  imports: [ListagemCliente],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('system-bank');
}

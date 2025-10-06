import { Routes } from '@angular/router';
import { CadastroCliente } from './pages/cliente/cadastro-cliente/cadastro-cliente';
import { ListagemCliente } from './pages/cliente/listagem-cliente/listagem-cliente';
import { LoginTemplate } from './pages/auth/login-template/login-template';
import { CadastroConta } from './pages/conta/cadastro-conta/cadastro-conta';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: LoginTemplate,
  },
  {
    path: 'cliente',
    children: [
      {
        path: 'novo',
        component: CadastroCliente
      },
      {
        path: 'editar/:id',
        component: CadastroCliente
      },
      {
        path: '',
        component: ListagemCliente,
      },
    ]
  },
  {
    path: 'conta',
    children: [
      {
        path: 'nova',
        component: CadastroConta
      },
      {
        path: 'editar/:id',
        component: CadastroConta
      }
    ]
  }
];

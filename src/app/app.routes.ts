import { Routes } from '@angular/router';
import { CadastroCliente } from './pages/cliente/cadastro-cliente/cadastro-cliente';
import { ListagemCliente } from './pages/cliente/listagem-cliente/listagem-cliente';
import { LoginTemplate } from './pages/auth/login-template/login-template';

export const routes: Routes = [
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
    path: '',
    component: ListagemCliente,
  },
];

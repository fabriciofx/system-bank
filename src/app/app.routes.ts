import { Routes } from '@angular/router';
import { LoginTemplate } from './pages/auth/login-template/login-template';
import { CadastroCliente } from './pages/cliente/cadastro-cliente/cadastro-cliente';
import { ListagemCliente } from './pages/cliente/listagem-cliente/listagem-cliente';
import { CadastroConta } from './pages/conta/cadastro-conta/cadastro-conta';
import { DepositoConta } from './pages/conta/deposito-conta/deposito-conta';
import { ListagemConta } from './pages/conta/listagem-conta/listagem-conta';
import { SaqueConta } from './pages/conta/saque-conta/saque-conta';
import { TransferenciaContas } from './pages/conta/transferencia-contas/transferencia-contas';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: LoginTemplate
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
        component: ListagemCliente
      }
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
      },
      {
        path: '',
        component: ListagemConta
      },
      {
        path: 'saque',
        component: SaqueConta
      },
      {
        path: 'deposito',
        component: DepositoConta
      },
      {
        path: 'transferencia',
        component: TransferenciaContas
      }
    ]
  }
];

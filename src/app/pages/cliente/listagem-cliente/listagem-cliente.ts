import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  computed,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import {
  ConfirmMessage,
  ErrorMessage,
  SuccessMessage
} from '../../../shared/components/message/message';
import { ErrorReasons } from '../../../shared/core/error-reasons';
import { PageResult } from '../../../shared/core/page-result';
import { Cliente } from '../../../shared/models/cliente';
import { ClienteService } from '../../../shared/services/cliente/cliente-service';

@Component({
  selector: 'app-listagem-cliente',
  standalone: true,
  templateUrl: './listagem-cliente.html',
  styleUrls: ['./listagem-cliente.scss'],
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    LoadingSpinner
  ]
})
export class ListagemCliente implements AfterViewInit {
  private readonly clienteService: ClienteService;
  private readonly result: WritableSignal<PageResult<Cliente>>;
  private readonly dataSource: MatTableDataSource<Cliente>;
  private readonly busy: WritableSignal<boolean>;
  private readonly full: Signal<number>;

  constructor(clienteService: ClienteService) {
    this.clienteService = clienteService;
    this.result = signal<PageResult<Cliente>>({
      items: [],
      page: 1,
      pageSize: 5,
      total: 0
    });
    this.dataSource = new MatTableDataSource<Cliente>();
    this.busy = signal(true);
    this.full = computed(() => this.result().total ?? 0);
  }

  ngAfterViewInit(): void {
    this.load(1, 5);
  }

  onPageChange(event: PageEvent): void {
    this.load(event.pageIndex + 1, event.pageSize);
  }

  source(): MatTableDataSource<Cliente> {
    return this.dataSource;
  }

  columns(): string[] {
    return ['id', 'nome', 'cpf', 'email', 'status', 'funcoes'];
  }

  total(): number {
    return this.full();
  }

  loading(): boolean {
    return this.busy();
  }

  load(index: number, size: number): void {
    this.busy.set(true);
    this.clienteService.pages(index, size).subscribe({
      next: (result: PageResult<Cliente>) => {
        this.result.set(result);
        this.dataSource.data = result.items;
        this.busy.set(false);
      },
      error: (error: HttpErrorResponse) => {
        new ErrorMessage(
          'Erro',
          'Não foi possível carregar a lista de clientes.',
          new ErrorReasons(error)
        ).show();
      }
    });
  }

  async deleteCliente(id: number): Promise<void> {
    const answer = await new ConfirmMessage(
      'Você tem certeza que deseja deletar?',
      'Não tem como reverter essa ação',
      'Deletar'
    ).show();
    if (answer.yes()) {
      this.clienteService.delete(id).subscribe({
        next: () => {
          new SuccessMessage('Sucesso', 'Cliente deletado com sucesso!').show();
          this.load(this.result().page, this.result().pageSize);
        },
        error: (error: HttpErrorResponse) => {
          new ErrorMessage(
            'Oops...',
            'Erro ao deletar cliente!',
            new ErrorReasons(error)
          ).show();
        }
      });
    }
  }

  // opcional: performance ao renderizar linhas
  trackById = (_: number, item: Cliente) => item.id;
}

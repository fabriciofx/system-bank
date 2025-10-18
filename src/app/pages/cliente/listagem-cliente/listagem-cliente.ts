import { AfterViewInit, Component, computed, signal, Signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmMessage, SuccessMessage, ErrorMessage } from '../../../shared/components/message/message';
import { ClienteService } from '../../../shared/services/cliente/cliente-service';
import { Cliente } from '../../../shared/models/cliente';
import { ErrorReasons } from '../../../shared/core/error-reasons';
import { PageResult } from '../../../shared/core/page-result';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';

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
      items: [], page: 1, pageSize: 5, total: 0
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
          new SuccessMessage(
            'Sucesso',
            'Cliente deletado com sucesso!'
          ).show();
          this.load(this.result().page, this.result().pageSize);
        },
        error: (error: HttpErrorResponse) => {
          new ErrorMessage(
            'Oops...',
            'Erro ao deletar cliente!',
            new ErrorReasons(error)
          ).show();
        },
      });
    }
  }

  // opcional: performance ao renderizar linhas
  trackById = (_: number, item: Cliente) => item.id;
}

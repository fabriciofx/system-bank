import { AfterViewInit, Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ErrorReasons } from '../../../shared/custom/error-reasons';
import { PageResult } from '../../../shared/custom/page-result';
import {
  ConfirmMessage,
  ErrorMessage,
  SuccessMessage
} from '../../../shared/custom/message';
import { ContaClienteService } from '../../../shared/services/conta-cliente/conta-cliente-service';
import { ContaCliente } from '../../../shared/models/conta-cliente';
import { LoadingSpinner } from "../../../shared/components/loading-spinner/loading-spinner";

@Component({
  selector: 'app-listagem-conta',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    LoadingSpinner
],
  templateUrl: './listagem-conta.html',
  styleUrl: './listagem-conta.scss'
})
export class ListagemConta implements AfterViewInit {
  private readonly contaClienteService: ContaClienteService;
  private readonly result: WritableSignal<PageResult<ContaCliente>>;
  private readonly dataSource: MatTableDataSource<ContaCliente>;
  private readonly busy: WritableSignal<boolean>;
  private readonly full: Signal<number>;

  constructor(contaClienteService: ContaClienteService) {
    this.contaClienteService = contaClienteService;
    this.result = signal<PageResult<ContaCliente>>({
      items: [], page: 1, pageSize: 5, total: 0
    });
    this.dataSource = new MatTableDataSource<ContaCliente>();
    this.busy = signal(true);
    this.full = computed(() => this.result().total ?? 0);
}

  ngAfterViewInit(): void {
    this.load(1, 5);
  }

  onPageChange(event: PageEvent): void {
    this.load(event.pageIndex + 1, event.pageSize);
  }

  source(): MatTableDataSource<ContaCliente> {
    return this.dataSource;
  }

  columns(): string[] {
    return ['id', 'cliente', 'numero', 'agencia', 'saldo', 'funcoes'];
  }

  total(): number {
    return this.full();
  }

  loading(): boolean {
    return this.busy();
  }

  load(index: number, size: number): void {
    this.busy.set(true);
    this.contaClienteService.paginas(index, size).subscribe({
      next: (result: PageResult<ContaCliente>) => {
        this.result.set(result);
        this.dataSource.data = result.items;
        this.busy.set(false);
      },
      error: (error) => {
        new ErrorMessage(
          'Erro',
          'Não foi possível carregar a lista de contas do cliente.',
          new ErrorReasons(error)
        ).show();
      }
    });
  }

  async deleteConta(id: number): Promise<void> {
    const answer = await new ConfirmMessage(
      'Você tem certeza que deseja deletar?',
      'Não tem como reverter essa ação',
      'Deletar'
    ).show()
    if (answer.isConfirmed) {
      this.contaClienteService.delete(id).subscribe({
        next: () => {
          new SuccessMessage(
            'Sucesso',
            'Conta deletada com sucesso!'
          ).show();
          this.load(this.result().page, this.result().pageSize);
        },
        error: (error) => {
          new ErrorMessage(
            'Oops...',
            'Erro ao deletar a conta!',
            new ErrorReasons(error)
          ).show();
        },
      });
    }
  }

  // opcional: performance ao renderizar linhas
  trackById = (_: number, item: ContaCliente) => item.id;
}

import { AfterViewInit, Component } from '@angular/core';
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
import { Box, BoxOf } from '../../../shared/custom/box';
import { ContaClienteService } from '../../../shared/services/conta-cliente/conta-cliente-service';
import { ContaCliente } from '../../../shared/models/conta-cliente';

@Component({
  selector: 'app-listagem-conta',
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './listagem-conta.html',
  styleUrl: './listagem-conta.scss'
})
export class ListagemConta implements AfterViewInit {
  private readonly contaClienteService: ContaClienteService;
  private readonly dataSource: MatTableDataSource<ContaCliente>;
  private readonly result: Box<PageResult<ContaCliente>>;

  constructor(contaClienteService: ContaClienteService) {
    this.contaClienteService = contaClienteService;
    this.dataSource = new MatTableDataSource<ContaCliente>();
    this.result = new BoxOf<PageResult<ContaCliente>>({
      items: [], page: 1, pageSize: 5, total: 5
    });
  }

  ngAfterViewInit(): void {
    this.carregaContas(this.result.value().page, this.result.value().pageSize);
  }

  onPageChange(event: PageEvent): void {
    const old = this.result.value();
    this.result.store({
      items: old.items,
      page: event.pageIndex + 1,
      pageSize: event.pageSize,
      total: old.total
    });
    this.carregaContas(this.result.value().page, this.result.value().pageSize);
  }

  source(): MatTableDataSource<ContaCliente> {
    return this.dataSource;
  }

  columns(): string[] {
    return ['id', 'cliente', 'numero', 'agencia', 'saldo', 'funcoes'];
  }

  content(): PageResult<ContaCliente> {
    return this.result.value();
  }

  carregaContas(page: number, pageSize: number): void {
    this.contaClienteService.paginas(page, pageSize).subscribe({
      next: (result: PageResult<ContaCliente>) => {
        this.result.store(result);
        this.dataSource.data = result.items;
      },
      error: (error) => {
        console.error(error);
        new ErrorMessage(
          'Erro',
          'Não foi possível carregar a lista de contas do cliente.',
          new ErrorReasons(error)
        ).show();
      }
    });
  }

  async deletaConta(id: number): Promise<void> {
    const result = await new ConfirmMessage(
      'Você tem certeza que deseja deletar?',
      'Não tem como reverter essa ação',
      'Deletar'
    ).show()
    if (result.isConfirmed) {
      this.contaClienteService.delete(id).subscribe({
        next: () => {
          new SuccessMessage(
            'Sucesso',
            'Conta deletada com sucesso!'
          ).show();
          this.carregaContas(
            this.result.value().page,
            this.result.value().pageSize
          );
        },
        error: (error) => {
          console.error(error);
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

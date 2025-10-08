import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmMessage, SuccessMessage, ErrorMessage } from '../../../shared/custom/message';
import { ClienteService } from '../../../shared/services/cliente/cliente-service';
import { Cliente } from '../../../shared/models/cliente';
import { ErrorReasons } from '../../../shared/custom/error-reasons';
import { PageResult } from '../../../shared/page/page-result';
import { Box, BoxOf } from '../../../shared/custom/box';

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
  ],
})
export class ListagemCliente implements AfterViewInit {
  private readonly clienteService: ClienteService;
  private readonly dataSource: MatTableDataSource<Cliente>;
  private readonly result: Box<PageResult<Cliente>>;

  constructor(clienteService: ClienteService) {
    this.clienteService = clienteService;
    this.dataSource = new MatTableDataSource<Cliente>();
    this.result = new BoxOf<PageResult<Cliente>>({
      items: [], page: 1, pageSize: 5, total: 5
    });
  }

  ngAfterViewInit(): void {
    this.carregaClientes(
      this.result.value().page,
      this.result.value().pageSize
    );
  }

  onPageChange(event: PageEvent): void {
    const old = this.result.value();
    this.result.store({
      items: old.items,
      page: event.pageIndex + 1,
      pageSize: event.pageSize,
      total: old.total
    });
    this.carregaClientes(
      this.result.value().page,
      this.result.value().pageSize
    );
  }

  columns(): string[] {
    return ['id', 'nome', 'cpf', 'email', 'status', 'funcoes'];
  }

  source(): MatTableDataSource<Cliente> {
    return this.dataSource;
  }

  content(): PageResult<Cliente> {
    return this.result.value();
  }

  carregaClientes(page: number, pageSize: number): void {
    this.clienteService.paginas(page, pageSize).subscribe({
      next: (result: PageResult<Cliente>) => {
        this.result.store(result);
        this.dataSource.data = result.items;
      },
      error: (error) => {
        console.error(error);
        new ErrorMessage(
          'Erro',
          'Não foi possível carregar a lista de clientes.',
          new ErrorReasons(error)
        ).show();
      }
    });
  }

  async deletarCliente(id: number): Promise<void> {
    const result = await new ConfirmMessage(
      'Você tem certeza que deseja deletar?',
      'Não tem como reverter essa ação',
      'Deletar'
    ).show()
    if (result.isConfirmed) {
      this.clienteService.delete(id).subscribe({
        next: () => {
          new SuccessMessage(
            'Sucesso',
            'Cliente deletado com sucesso!'
          ).show();
          this.carregaClientes(
            this.result.value().page,
            this.result.value().pageSize
          );
        },
        error: (error) => {
          console.error(error);
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

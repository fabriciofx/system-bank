import { AfterViewInit, Component, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmMessage, SuccessMessage, ErrorMessage } from '../../../shared/message/message';
import { ClienteService } from '../../../shared/services/cliente/cliente-service';
import { Cliente } from '../../../shared/models/cliente';
import { SbError } from '../../../shared/error/sb-error';
import { PageResult } from '../../../shared/page/page-result';

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
  private clienteService = inject(ClienteService);

  // colunas exibidas na tabela
  displayedColumns: string[] = ['id', 'nome', 'cpf', 'email', 'status', 'funcoes'];

  // datasource do Material (poderia ser Cliente[]; usando MatTableDataSource
  // por compatibilidade com seu template)
  dataSource = new MatTableDataSource<Cliente>([]);

  // paginação (server-side)
  totalClientes = 0;
  pageIndex = 0; // zero-based para o paginator
  pageSize = 5;
  loading = signal(false);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  result: PageResult<Cliente> | null = null;

  ngAfterViewInit(): void {
    this.listarClientes(this.pageIndex + 1, this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.listarClientes(this.pageIndex + 1, this.pageSize);
  }

  listarClientes(page: number, pageSize: number): void {
    this.loading.set(true);
    this.clienteService.paginas(page, pageSize).subscribe({
      next: (result: PageResult<Cliente>) => {
        this.result = result;
        this.dataSource.data = result.items;
      },
      error: (error) => {
        console.error(error);
        this.loading.set(false);
        new ErrorMessage(
          'Erro',
          'Não foi possível carregar a lista de clientes.',
          new SbError(error)
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
          this.listarClientes(this.pageIndex + 1, this.pageSize);
        },
        error: (error) => {
          console.error(error);
          new ErrorMessage(
            'Oops...',
            'Erro ao deletar cliente!',
            new SbError(error)
          ).show();
        },
      });
    }
  }

  // opcional: performance ao renderizar linhas
  trackById = (_: number, item: Cliente) => item.id;
}

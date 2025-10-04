import { AfterViewInit, Component, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { ClienteService } from '../../../shared/services/cliente/cliente-service';
import { Cliente } from '../../../shared/models/cliente';

// Se sua API ainda não retorna este formato, ajuste o service para retornar {
// items, total }.
export interface PageResult<T> {
  items: T[];
  total: number;
}

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

  ngAfterViewInit(): void {
    this.listarClientes(this.pageIndex + 1, this.pageSize);
  }

  listarClientes(page: number, pageSize: number): void {
    this.loading.set(true);
    // Ajuste seu service para retornar Observable<PageResult<Cliente>>
    this.clienteService.paginas(page, pageSize).subscribe({
      next: (res: PageResult<Cliente> | Cliente[]) => {
        // fallback: se a API ainda retornar apenas array, tenta deduzir total
        if (Array.isArray(res)) {
          this.dataSource.data = res;
          // Caso não saiba o total, use um valor aproximado (ex.: page *
          // pageSize + 1) Recomendo fortemente evoluir sua API para retornar {
          // items, total }
          this.totalClientes = this.pageIndex * this.pageSize + res.length;
        } else {
          this.dataSource.data = res.items;
          this.totalClientes = res.total;
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar a lista de clientes.',
        });
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;         // zero-based
    this.pageSize = event.pageSize;
    this.listarClientes(this.pageIndex + 1, this.pageSize); // sua API usa 1-based
  }

  deletarCliente(id: number): void {
    Swal.fire({
      title: 'Você tem certeza que deseja deletar?',
      text: 'Não tem como reverter essa ação',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'grey',
      confirmButtonText: 'Deletar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Sucesso',
              text: 'Cliente deletado com sucesso!',
              showConfirmButton: false,
              timer: 1500,
            });
            // Recarrega a página atual (mantendo página/size)
            this.listarClientes(this.pageIndex + 1, this.pageSize);
          },
          error: (error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Erro ao deletar cliente!',
            });
          },
        });
      }
    });
  }

  // opcional: performance ao renderizar linhas
  trackById = (_: number, item: Cliente) => item.id;
}

import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { Cliente } from '../../../shared/models/cliente';
import { ClienteService } from '../../../shared/services/cliente/cliente-service';

@Component({
  selector: 'app-listagem-cliente',
  imports: [RouterModule, MatTableModule, MatIconModule, MatButton, MatPaginatorModule],
  templateUrl: './listagem-cliente.html',
  styleUrl: './listagem-cliente.scss'
})
export class ListagemCliente {
  displayedColumns: string[] = ['id', 'nome', 'cpf', 'email', 'status', 'funcoes'];
  dataSource = new MatTableDataSource<Cliente>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private clienteService: ClienteService){
  }

  ngAfterViewInit() {
    this.listarClientes(1, 5)
  }

  listarClientes(page: number, pageSize: number) {
    this.clienteService.paginas(page, pageSize).subscribe(clientes => {
      this.dataSource.data = clientes;
    });
  }

  onPageChange(event: PageEvent) {
    const pageIndex = event.pageIndex + 1;
    const pageSize = event.pageSize;
    this.listarClientes(pageIndex, pageSize);
  }

  deletarCLiente(id: number){
    Swal.fire({
      title: 'Você tem certeza que deseja deletar?',
      text: "Não tem como reverter essa ação",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'grey',
      confirmButtonText: 'Deletar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Sucesso',
              text: 'Cliente deletado com sucesso!',
              showConfirmButton: false,
              timer: 1500
            })
            this.listarClientes(1,5)
          },
          error: (error) => {
            console.error(error)
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Erro ao deletar cliente!',
            });
          }
        });
      }
    });
  }
}

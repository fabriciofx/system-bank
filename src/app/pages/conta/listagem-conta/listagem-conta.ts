import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Conta } from '../../../shared/models/conta';
import { ContaService } from '../../../shared/services/conta/conta-service';
import { SbError } from '../../../shared/error/sb-error';
import { PageResult } from '../../../shared/page/page-result';
import {
  ConfirmMessage,
  ErrorMessage,
  SuccessMessage
} from '../../../shared/message/message';

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
  dataSource = new MatTableDataSource<Conta>();
  result: PageResult<Conta> | null = null;
  private contaService = inject(ContaService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'id', 'cliente', 'numero', 'agencia', 'saldo', 'funcoes'
  ];
  pageIndex = 0;
  pageSize = 5;

  ngAfterViewInit(): void {
    this.listarContas(this.pageIndex + 1, this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.listarContas(this.pageIndex + 1, this.pageSize);
  }

  listarContas(page: number, pageSize: number): void {
    this.contaService.paginas(page, pageSize).subscribe({
      next: (result: PageResult<Conta>) => {
        this.result = result;
        this.dataSource.data = result.items;
      },
      error: (error) => {
        console.error(error);
        new ErrorMessage(
          'Erro',
          'Não foi possível carregar a lista de contas do cliente.',
          new SbError(error)
        ).show();
      }
    });
  }

  async deletarConta(id: number): Promise<void> {
    const result = await new ConfirmMessage(
      'Você tem certeza que deseja deletar?',
      'Não tem como reverter essa ação',
      'Deletar'
    ).show()
    if (result.isConfirmed) {
      this.contaService.delete(id).subscribe({
        next: () => {
          new SuccessMessage(
            'Sucesso',
            'Conta deletada com sucesso!'
          ).show();
          this.listarContas(this.pageIndex + 1, this.pageSize);
        },
        error: (error) => {
          console.error(error);
          new ErrorMessage(
            'Oops...',
            'Erro ao deletar a conta!',
            new SbError(error)
          ).show();
        },
      });
    }
  }

  // opcional: performance ao renderizar linhas
  trackById = (_: number, item: Conta) => item.id;
}

import {
  AfterViewInit,
  Component,
  inject,
  signal,
  ViewChild
} from '@angular/core';
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
  private contaService = inject(ContaService);

  // colunas exibidas na tabela
  displayedColumns: string[] = [
    'id', 'cliente', 'numero', 'agencia', 'saldo', 'status', 'funcoes'
  ];

  // datasource do Material (poderia ser Cliente[]; usando MatTableDataSource
  // por compatibilidade com seu template)
  dataSource = new MatTableDataSource<Conta>([]);

  // paginação (server-side)
  totalContas = 0;
  pageIndex = 0; // zero-based para o paginator
  pageSize = 5;
  loading = signal(false);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.listarContas(this.pageIndex + 1, this.pageSize);
  }

  listarContas(page: number, pageSize: number): void {
    this.loading.set(true);
    // Ajuste seu service para retornar Observable<PageResult<Cliente>>
    this.contaService.paginas(page, pageSize).subscribe({
      next: (res: PageResult<Conta> | Conta[]) => {
        // fallback: se a API ainda retornar apenas array, tenta deduzir total
        if (Array.isArray(res)) {
          this.dataSource.data = res;
          // Caso não saiba o total, use um valor aproximado (ex.: page *
          // pageSize + 1) Recomendo fortemente evoluir sua API para retornar {
          // items, total }
          this.totalContas = this.pageIndex * this.pageSize + res.length;
        } else {
          this.dataSource.data = res.items;
          this.totalContas = res.total;
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.loading.set(false);
        new ErrorMessage(
          'Erro',
          'Não foi possível carregar a lista de contas do cliente.',
          new SbError(error)
        ).show();
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.listarContas(this.pageIndex + 1, this.pageSize);
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
          // Recarrega a página atual (mantendo página/size)
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

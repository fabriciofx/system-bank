import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, inject, Input, NgZone, Output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageResult } from '../../page/page-result';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente/cliente-service';
import { ErrorMessage } from '../../message/message';
import { SbError } from '../../error/sb-error';

@Component({
  selector: 'app-infinite-select',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatProgressSpinnerModule],
  templateUrl: './infinite-select.html',
  styleUrl: './infinite-select.scss'
})
export class InfiniteSelect implements AfterViewInit {
  private readonly zone: NgZone;
  private readonly cdr: ChangeDetectorRef;
  private readonly onScrollBound = (event: Event) => this.onScroll(event);
  private readonly clienteService: ClienteService = inject(ClienteService);

  @ViewChild('select') select!: MatSelect;
  @Input() placeholder: string = 'Selecione um item';
  @Input() panelClass: string = 'infinite-select';
  @Input() pageSize: number = 10;

  @Output() itemSelected: EventEmitter<any> = new EventEmitter<any>();

  result!: PageResult<Cliente>;
  items: number[] = [];
  pageIndex = 1;
  loading = false;

  constructor(zone: NgZone, cdr: ChangeDetectorRef) {
    this.zone = zone;
    this.cdr = cdr;
  }

  ngAfterViewInit(): void {
    this.listarClientes(this.pageIndex, this.pageSize);
  }

  onOpenedChange(opened: boolean) {
    if (opened) {
      this.zone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          const panel = this.select.panel?.nativeElement;
          if (panel) {
            panel.removeEventListener('scroll', this.onScrollBound);
            panel.addEventListener('scroll', this.onScrollBound);
          }
        });
      });
    }
  }

  onSelect(event: any): void {
    const item = { value: event.value };
    this.itemSelected.emit(item);
  }

  onScroll(event: Event): void {
    const tolerance = 5;
    const panel = event.target as HTMLElement;
    const height = panel.scrollTop + panel.clientHeight;
    const scrollHeight = panel.scrollHeight - tolerance;
    if (height >= scrollHeight) {
      this.loading = true;
      if (this.pageIndex * this.pageSize <= this.result.total) {
        this.pageIndex++;
      }
      this.zone.run(async () => {
        this.listarClientes(this.pageIndex, this.pageSize);
        this.cdr.detectChanges();
      });
      this.loading = false;
    }
  }

  listarClientes(page: number, pageSize: number): void {
    this.clienteService.paginas(page, pageSize).subscribe({
      next: (result: PageResult<Cliente>) => {
        this.items = Array.from(
          new Set([
            ...this.items,
            ...result.items.map(cliente => cliente.id)
          ])
        );
        this.result = result;
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
}

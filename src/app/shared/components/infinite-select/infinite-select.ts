import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageResult } from '../../custom/page-result';
import { ErrorMessage } from '../../custom/message';
import { ErrorReasons } from '../../custom/error-reasons';
import { Paginated } from '../../custom/paginated';
import { Text } from '../../custom/text';

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
export class InfiniteSelect<T extends Text> implements AfterViewInit {
  private readonly zone: NgZone;
  private readonly cdr: ChangeDetectorRef;
  private readonly onScrollBound = (event: Event) => this.onScroll(event);

  @ViewChild('select') select!: MatSelect;
  @Input() paginated!: Paginated<T>;
  @Input() placeholder: string = 'Select an item';
  @Input() panelClass: string = 'infinite-select';
  @Input() pageSize: number = 10;

  @Output() itemSelected: EventEmitter<any> = new EventEmitter<any>();

  result!: PageResult<T>;
  items: T[] = [];
  pageIndex = 1;
  loading = false;

  constructor(zone: NgZone, cdr: ChangeDetectorRef) {
    this.zone = zone;
    this.cdr = cdr;
  }

  ngAfterViewInit(): void {
    this.load(this.pageIndex, this.pageSize);
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

  onSelect(event: MatSelectChange): void {
    this.itemSelected.emit(event.value);
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
        this.paginated.paginas(this.pageIndex, this.pageSize);
        this.cdr.detectChanges();
      });
      this.loading = false;
    }
  }

  load(page: number, pageSize: number): void {
    this.paginated.paginas(page, pageSize).subscribe({
      next: (result: PageResult<T>) => {
        this.items = Array.from(
          new Set([
            ...this.items,
            ...result.items
          ])
        );
        this.result = result;
      },
      error: (error) => {
        console.error(error);
        new ErrorMessage(
          'Error',
          'Do not possible load pages from Paginated.',
          new ErrorReasons(error)
        ).show();
      }
    });
  }
}

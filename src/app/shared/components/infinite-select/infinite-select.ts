import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatSelect,
  MatSelectChange,
  MatSelectModule
} from '@angular/material/select';
import { ErrorReasons } from '../../core/error-reasons';
import { PageResult } from '../../core/page-result';
import { Paginated } from '../../core/paginated';
import { Text } from '../../core/text';
import { ErrorMessage } from '../message/message';

@Component({
  selector: 'app-infinite-select',
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatLabel,
    MatOptionModule
  ],
  templateUrl: './infinite-select.html',
  styleUrl: './infinite-select.scss'
})
export class InfiniteSelect<T extends Text> implements AfterViewInit {
  private readonly zone: NgZone;
  private readonly cdr: ChangeDetectorRef;
  private readonly onScrollBound = (event: Event) => this.onScroll(event);

  @ViewChild('select') select!: MatSelect;
  @Input() paginated!: Paginated<T>;
  @Input() placeholder = 'Select an item';
  @Input() panelClass = 'infinite-select';
  @Input() pageSize = 10;

  @Output() itemSelected: EventEmitter<T> = new EventEmitter<T>();

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

  onSelect(event: MatSelectChange<T>): void {
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
        this.paginated.pages(this.pageIndex, this.pageSize);
        this.cdr.detectChanges();
      });
      this.loading = false;
    }
  }

  load(page: number, pageSize: number): void {
    this.paginated.pages(page, pageSize).subscribe({
      next: (result: PageResult<T>) => {
        this.items = Array.from(new Set([...this.items, ...result.items]));
        this.result = result;
      },
      error: (error: HttpErrorResponse) => {
        new ErrorMessage(
          'Error',
          'It is not possible to load pages from Paginated.',
          new ErrorReasons(error)
        ).show();
      }
    });
  }
}

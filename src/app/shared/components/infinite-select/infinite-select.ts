import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, NgZone, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelect, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-infinite-select',
  imports: [CommonModule, FormsModule, MatSelectModule],
  templateUrl: './infinite-select.html',
  styleUrl: './infinite-select.scss'
})
export class InfiniteSelect implements AfterViewInit {
  private readonly onScrollBound = (event: Event) => this.onScroll(event);

  @ViewChild('select') select!: MatSelect;

  @Input() label: string = 'Selecione um item';
  @Input() loadItems!: (page: number, pageSize: number) => Promise<any[]>;

  selected: string | null = null;
  items: string[] = [];
  page = 0;
  pageSize = 20;
  totalItems = 1000;
  loading = false;
  allLoaded = false;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {
    console.log('constructor');
  }

  ngAfterViewInit() {
    console.log('after view init');
  }

  ngOnInit() {
    console.log('on init');
    this.loadMore();
  }

  ngOnDestroy() {
    console.log('on destroy');
  }

  onClick() {
    console.log('clicked');
  }

  onOpenedChange(opened: boolean) {
    console.log('Select aberto?', opened);
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

  onScroll(event: Event) {
    const panel = event.target as HTMLElement;
    const end = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 5;
    if (end) {
      console.log('end');
      this.zone.run(async () => {
        await this.loadMore();
        this.cdr.detectChanges();
      });
    }
  }

  loadMore(): Promise<void> {
    console.log('loadMore');
    return new Promise<void>(
      (resolve) => {
        if (this.loading == false && this.items.length < this.totalItems) {
          this.loading = true;
          console.log('loading...');
          setTimeout(() => {
            console.log('start more');
            const start = this.page * this.pageSize;
            const end = Math.min(start + this.pageSize, this.totalItems);
            const newItems = Array.from({ length: end - start }, (_, i) => `Item ${start + i + 1}`);
            this.items = [...this.items, ...newItems];
            this.page++;
            console.log(`start: ${start}, end: ${end}, page: ${this.page}, items: ${this.items}`);
            this.loading = false;
            console.log('end more');
            resolve();
          }, 200);
        }
      }
    );
  }
}

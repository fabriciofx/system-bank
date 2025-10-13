import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteSelect } from './infinite-select';
import { Cliente } from '../../models/cliente';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Paginated } from '../../core/paginated';
import { of } from 'rxjs';

class FakePaginated implements Paginated<Cliente> {
  pages(num: number, size: number) {
    return of({
      items: [],
      page: num,
      pageSize: size,
      total: 0
    });
  }
}

describe('InfiniteSelect', () => {
  let component: InfiniteSelect<Cliente>;
  let fixture: ComponentFixture<InfiniteSelect<Cliente>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfiniteSelect],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfiniteSelect<Cliente>);
    component = fixture.componentInstance;
    component.paginated = new FakePaginated();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteSelect } from './infinite-select';
import { Cliente } from '../../models/cliente';

describe('InfiniteSelect', () => {
  let component: InfiniteSelect<Cliente>;
  let fixture: ComponentFixture<InfiniteSelect<Cliente>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfiniteSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfiniteSelect<Cliente>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

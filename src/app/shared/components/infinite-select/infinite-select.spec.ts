import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteSelect } from './infinite-select';

describe('InfiniteSelect', () => {
  let component: InfiniteSelect;
  let fixture: ComponentFixture<InfiniteSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfiniteSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfiniteSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

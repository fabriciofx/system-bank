import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaqueConta } from './saque-conta';

describe('SaqueConta', () => {
  let component: SaqueConta;
  let fixture: ComponentFixture<SaqueConta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaqueConta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaqueConta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

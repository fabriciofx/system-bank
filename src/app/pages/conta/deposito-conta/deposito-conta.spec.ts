import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositoConta } from './deposito-conta';

describe('DepositoConta', () => {
  let component: DepositoConta;
  let fixture: ComponentFixture<DepositoConta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositoConta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositoConta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

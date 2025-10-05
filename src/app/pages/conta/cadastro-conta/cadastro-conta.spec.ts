import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroConta } from './cadastro-conta';

describe('CadastroConta', () => {
  let component: CadastroConta;
  let fixture: ComponentFixture<CadastroConta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroConta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroConta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

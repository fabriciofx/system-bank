import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListagemConta } from './listagem-conta';

describe('ListagemConta', () => {
  let component: ListagemConta;
  let fixture: ComponentFixture<ListagemConta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListagemConta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListagemConta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

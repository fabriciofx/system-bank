import 'zone.js';
import 'zone.js/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { SuccessMessage } from './message';

@Component({
  template: '',
  standalone: true,
})
class DummyComponent {}

describe('Test for Message(s)', () => {
  let fixture: ComponentFixture<DummyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DummyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DummyComponent);
  });

  it('Must show a SuccessMessage with correct icon, title, and text',
    async () => {
      const msg = new SuccessMessage('Success', 'Operation completed');
      await msg.show();

      // Pega o container do SweetAlert2
      const container = document.body.querySelector('.swal2-container');
      expect(container).not.toBeNull();

      // Verifica título
      const title = container?.querySelector('.swal2-title');
      expect(title?.textContent).toBe('Success');

      // Verifica texto
      const text = container?.querySelector('.swal2-html-container');
      expect(text?.textContent).toBe('Operation completed');

      // Verifica ícone (o Swal adiciona uma classe .swal2-success para alertas de sucesso)
      const icon = container?.querySelector('.swal2-success');
      expect(icon).not.toBeNull();

      // Fecha o alert para limpar o DOM
      Swal.close();
    }
  );
});

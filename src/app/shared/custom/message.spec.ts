import 'zone.js';
import 'zone.js/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
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

      // Pega o container
      const container = document.body.querySelector('.swal2-container');
      expect(container).not.toBeNull();

      // Verifica título
      const title = container?.querySelector('.swal2-title');
      expect(title?.textContent).toBe('Success');

      // Verifica texto
      const text = container?.querySelector('.swal2-html-container');
      expect(text?.textContent).toBe('Operation completed');

      // Verifica ícone
      const icon = container?.querySelector('.swal2-success');
      expect(icon).not.toBeNull();

      // Fecha a message
      msg.close();
    }
  );
});

import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ErrorMessage, SuccessMessage } from './message';

@Component({
  template: '',
  standalone: true
})
class DummyComponent {}

describe('Test for Message(s)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DummyComponent]
    }).compileComponents();
  });

  it('Must show a SuccessMessage with correct icon, title, and text', async () => {
    const msg = new SuccessMessage('Success', 'Operation completed');
    const hold = msg.show();

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

    // Aguarda até o teste ser finalizado
    await hold;
  });

  it('Must show an ErrorMessage with correct icon, title, and text', async () => {
    const msg = new ErrorMessage('Error', 'Operation not completed');
    const ok = msg.show();

    // Pega o container
    const container = document.body.querySelector('.swal2-container');
    expect(container).not.toBeNull();

    // Verifica título
    const title = container?.querySelector('.swal2-title');
    expect(title?.textContent).toBe('Error');

    // Verifica texto
    const text = container?.querySelector('.swal2-html-container');
    expect(text?.textContent).toBe('Operation not completed');

    // // Verifica ícone
    const icon = container?.querySelector('.swal2-error');
    expect(icon).not.toBeNull();

    // Clica no botão "OK"
    const okButton = container?.querySelector('.swal2-confirm') as HTMLElement;
    okButton?.click();

    // Aguarda até o botão ok ser apertado
    await ok;
  });
});

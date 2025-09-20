import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { Cliente } from '../../../shared/models/cliente';
import { ClienteService } from '../../../shared/services/cliente/cliente-service';

@Component({
  selector: 'app-cadastro-cliente',
  imports: [MatInputModule, MatFormFieldModule, MatRadioModule, CommonModule,
    FormsModule, ReactiveFormsModule],
  templateUrl: './cadastro-cliente.html',
  styleUrl: './cadastro-cliente.scss'
})
export class CadastroCliente {
  formGroup: FormGroup;

  constructor(private clienteService: ClienteService, private router: Router){
    this.formGroup = new FormGroup({
      id: new FormControl(null),
      nome: new FormControl('', Validators.required),
      cpf: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      observacoes: new FormControl('', Validators.required),
      ativo: new FormControl(true)
    });
  }

  ngOnInit(): void {
  }

  cadastrar() {
    const cliente: Cliente = this.formGroup.value;
    this.clienteService.insere(cliente).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Cliente cadastrado com sucesso!',
          showConfirmButton: false,
          timer: 1500
        })
        this.router.navigate(['/cliente'])
      },
      error: (error) => {
        console.error(error)
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Erro ao cadastrar cliente!',
        })
      }
    });
  }
}

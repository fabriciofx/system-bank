import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../shared/services/cliente/cliente-service';
import { Cliente } from '../../../shared/models/cliente';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cadastro-cliente',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './cadastro-cliente.html',
  styleUrl: './cadastro-cliente.scss'
})
export class CadastroCliente {
  editar;
  formGroup: FormGroup;
  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formGroup = new FormGroup({
      id: new FormControl(null),
      nome: new FormControl('', Validators.required),
      cpf: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      observacoes: new FormControl('', Validators.required),
      ativo: new FormControl(true)
    });
    this.editar = false
  }

  ngOnInit(): void {
    if (this.route.snapshot.params["id"]){
      this.editar = true
      this.clienteService.pesquisaPorId(this.route.snapshot.params["id"]).subscribe(
        cliente => {
          this.formGroup.patchValue(cliente)
        }
      )
    }
  }

  cadastrar() {
    const cliente: Cliente = this.formGroup.value;
    if (this.editar) {
      this.clienteService.atualize(cliente).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Cliente atualizado com sucesso!',
            showConfirmButton: false,
            timer: 1500
          })
          this.router.navigate(['/cliente']);
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Erro ao atualizar cliente!',
          });
        }
      });
    } else {
      // Modo de criação
      this.clienteService.insere(cliente).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Cliente cadastrado com sucesso!',
            showConfirmButton: false,
            timer: 1500
          })
          this.router.navigate(['/cliente']);
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Erro ao cadastrar cliente!',
          });
        }
      });
    }
  }
}

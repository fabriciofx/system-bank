import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContaService } from '../../../shared/services/conta/conta-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Conta } from '../../../shared/models/conta';
import { InfiniteSelect } from "../../../shared/components/infinite-select/infinite-select";

@Component({
  selector: 'app-cadastro-conta',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteSelect
],
  templateUrl: './cadastro-conta.html',
  styleUrl: './cadastro-conta.scss'
})
export class CadastroConta {
  private readonly formGroup: FormGroup;
  private editar: boolean;

  constructor(
    private contaService: ContaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formGroup = new FormGroup({
      id: new FormControl(null),
      cliente: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
      agencia: new FormControl('', Validators.required),
      saldo: new FormControl('', Validators.required),
      ativa: new FormControl(true)
    });
    this.editar = false
  }

  ngOnInit(): void {
    if (this.route.snapshot.params["id"]) {
      this.editar = true;
      this.contaService.pesquisaPorId(
        this.route.snapshot.params["id"]
      ).subscribe(
        conta => {
          this.formGroup.patchValue(conta)
        }
      );
    }
  }

  form(): FormGroup {
    return this.formGroup;
  }

  cadastrar() {
    const conta: Conta = this.formGroup.value;
    if (this.editar) {
      this.contaService.atualize(conta).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Conta atualizada com sucesso!',
            showConfirmButton: false,
            timer: 1500
          })
          this.router.navigate(['/conta']);
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Erro ao atualizar a conta!',
          });
        }
      });
    } else {
      // Modo de criação
      this.contaService.insere(conta).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: 'Conta cadastrada com sucesso!',
            showConfirmButton: false,
            timer: 1500
          })
          this.router.navigate(['/conta']);
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Erro ao cadastrar a conta!',
          });
        }
      });
    }
  }
}

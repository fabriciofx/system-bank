import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContaService } from '../../../shared/services/conta/conta-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Conta } from '../../../shared/models/conta';
import { InfiniteSelect } from "../../../shared/components/infinite-select/infinite-select";
import { Box, BoxOf } from '../../../shared/box/box';

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
  private readonly router: Router;
  private readonly route: ActivatedRoute;
  private readonly contaService: ContaService;
  private readonly formGroup: FormGroup;
  private readonly editar: Box<boolean>;

  constructor(
    router: Router,
    route: ActivatedRoute,
    contaService: ContaService
  ) {
    this.router = router;
    this.route = route;
    this.contaService = contaService;
    this.formGroup = new FormGroup({
      id: new FormControl(null),
      cliente: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
      agencia: new FormControl('', Validators.required),
      saldo: new FormControl('', Validators.required)
    });
    this.editar = new BoxOf<boolean>(false);
  }

  ngOnInit(): void {
    if (this.route.snapshot.params["id"]) {
      this.editar.store(true);
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

  onClienteSelecionado(event: { value: number }): void {
    this.formGroup.get('cliente')?.setValue(event.value);
  }

  cadastrar() {
    const conta: Conta = this.formGroup.value;
    if (this.editar.value()) {
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

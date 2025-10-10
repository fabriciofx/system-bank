import { Component } from '@angular/core';
import { InfiniteSelect } from "../../../shared/components/infinite-select/infinite-select";
import { MatInputModule } from "@angular/material/input";
import { ContaService } from '../../../shared/services/conta/conta-service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Paginated } from '../../../shared/custom/paginated';
import { Conta } from '../../../shared/models/conta';
import { Saque } from '../../../shared/models/saque';
import { ErrorMessage, SuccessMessage } from '../../../shared/custom/message';
import { ErrorReasons } from '../../../shared/custom/error-reasons';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ContaClienteService } from '../../../shared/services/conta-cliente/conta-cliente-service';
import { ContaCliente } from '../../../shared/models/conta-cliente';


@Component({
  selector: 'app-saque-conta',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteSelect
  ],
  templateUrl: './saque-conta.html',
  styleUrl: './saque-conta.scss'
})
export class SaqueConta {
  private readonly router: Router;
  private readonly contaService: ContaService;
  private readonly formGroup: FormGroup;
  private readonly contaClienteService: ContaClienteService;

  constructor(
    router: Router,
    contaService: ContaService,
    contaClienteService: ContaClienteService
  ) {
    this.router = router;
    this.contaService = contaService;
    this.contaClienteService = contaClienteService;
    this.formGroup = new FormGroup({
      conta: new FormControl('', Validators.required),
      valor: new FormControl('', Validators.required),
    });
  }

  onContaSelecionada(value: any): void {
    const conta = value as ContaCliente;
    this.formGroup.get('conta')?.setValue(conta.id);
  }

  form(): FormGroup {
    return this.formGroup;
  }

  contas(): Paginated<ContaCliente> {
    return this.contaClienteService;
  }

  saque() {
    const saque: Saque = this.formGroup.value;
    this.contaService.saque(saque).subscribe({
        next: () => {
          new SuccessMessage(
            'Sucesso',
            'Saque realizado com sucesso!'
          ).show();
          this.router.navigate(['/conta']);
        },
        error: (error) => {
          new ErrorMessage(
            'Oops...',
            'Erro ao sacar a conta!',
            new ErrorReasons(error)
          ).show();
        }
    });
  }
}

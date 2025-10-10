import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InfiniteSelect } from '../../../shared/components/infinite-select/infinite-select';
import { ErrorReasons } from '../../../shared/custom/error-reasons';
import { SuccessMessage, ErrorMessage } from '../../../shared/custom/message';
import { Paginated } from '../../../shared/custom/paginated';
import { ContaCliente } from '../../../shared/models/conta-cliente';
import { ContaClienteService } from '../../../shared/services/conta-cliente/conta-cliente-service';
import { ContaService } from '../../../shared/services/conta/conta-service';
import { Router } from '@angular/router';
import { Deposito } from '../../../shared/models/deposito';

@Component({
  selector: 'app-deposito-conta',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteSelect
  ],
  templateUrl: './deposito-conta.html',
  styleUrl: './deposito-conta.scss'
})
export class DepositoConta {
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

  deposite() {
    const deposito: Deposito = this.formGroup.value;
    this.contaService.deposito(deposito).subscribe({
        next: () => {
          new SuccessMessage(
            'Sucesso',
            'Depósito realizado com sucesso!'
          ).show();
          this.router.navigate(['/conta']);
        },
        error: (error) => {
          new ErrorMessage(
            'Oops...',
            'Erro ao depositar na conta!',
            new ErrorReasons(error)
          ).show();
        }
    });
  }
}

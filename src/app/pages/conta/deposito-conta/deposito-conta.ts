import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { InfiniteSelect } from '../../../shared/components/infinite-select/infinite-select';
import {
  ErrorMessage,
  SuccessMessage
} from '../../../shared/components/message/message';
import { ErrorReasons } from '../../../shared/core/error-reasons';
import { Paginated } from '../../../shared/core/paginated';
import { ContaCliente } from '../../../shared/models/conta-cliente';
import { Deposito } from '../../../shared/models/deposito';
import { ContaService } from '../../../shared/services/conta/conta-service';
import { ContaClienteService } from '../../../shared/services/conta-cliente/conta-cliente-service';

@Component({
  selector: 'app-deposito-conta',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
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
      valor: new FormControl('', Validators.required)
    });
  }

  onContaSelecionada(contaCliente: ContaCliente): void {
    this.formGroup.get('conta')?.setValue(contaCliente.id);
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
        new SuccessMessage('Sucesso', 'Depósito realizado com sucesso!').show();
        this.router.navigate(['/conta']);
      },
      error: (error: HttpErrorResponse) => {
        new ErrorMessage(
          'Oops...',
          'Erro ao depositar na conta!',
          new ErrorReasons(error)
        ).show();
      }
    });
  }
}

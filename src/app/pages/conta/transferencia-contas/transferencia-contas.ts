import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContaService } from '../../../shared/services/conta/conta-service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContaClienteService } from '../../../shared/services/conta-cliente/conta-cliente-service';
import { ContaCliente } from '../../../shared/models/conta-cliente';
import { Paginated } from '../../../shared/core/paginated';
import {
  ErrorMessage,
  SuccessMessage,
} from '../../../shared/components/message/message';
import { ErrorReasons } from '../../../shared/core/error-reasons';
import { Transferencia } from '../../../shared/models/transferencia';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InfiniteSelect } from '../../../shared/components/infinite-select/infinite-select';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-transferencia-contas',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteSelect,
  ],
  templateUrl: './transferencia-contas.html',
  styleUrl: './transferencia-contas.scss',
})
export class TransferenciaContas {
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
      conta_origem: new FormControl('', Validators.required),
      conta_destino: new FormControl('', Validators.required),
      valor: new FormControl('', Validators.required),
    });
  }

  onContaOrigemSelecionada(contaCliente: ContaCliente): void {
    this.formGroup.get('conta_origem')?.setValue(contaCliente.id);
  }

  onContaDestinoSelecionada(contaCliente: ContaCliente): void {
    this.formGroup.get('conta_destino')?.setValue(contaCliente.id);
  }

  form(): FormGroup {
    return this.formGroup;
  }

  contas(): Paginated<ContaCliente> {
    return this.contaClienteService;
  }

  transfere() {
    const transferencia: Transferencia = this.formGroup.value;
    this.contaService.transferencia(transferencia).subscribe({
      next: () => {
        new SuccessMessage(
          'Sucesso',
          'Transferência realizada com sucesso!'
        ).show();
        this.router.navigate(['/conta']);
      },
      error: (error: HttpErrorResponse) => {
        new ErrorMessage(
          'Oops...',
          'Erro ao tentar transferir entre as contas!',
          new ErrorReasons(error)
        ).show();
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContaService } from '../../../shared/services/conta/conta-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { ContaDe } from '../../../shared/models/conta';
import { InfiniteSelect } from "../../../shared/components/infinite-select/infinite-select";
import { Box, BoxOf } from '../../../shared/custom/box';
import { ErrorMessage, SuccessMessage } from '../../../shared/components/message/message';
import { ErrorReasons } from '../../../shared/custom/error-reasons';
import { Paginated } from '../../../shared/custom/paginated';
import { ClienteService } from '../../../shared/services/cliente/cliente-service';
import { Cliente } from '../../../shared/models/cliente';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';

type ContaFormGroup = FormGroup<{
  id: FormControl<number>;
  cliente: FormControl<number>;
  numero: FormControl<string>;
  agencia: FormControl<string>;
  saldo: FormControl<string>;
}>;

@Component({
  selector: 'app-cadastro-conta',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteSelect
],
  templateUrl: './cadastro-conta.html',
  styleUrl: './cadastro-conta.scss'
})
export class CadastroConta implements OnInit {
  private readonly router: Router;
  private readonly route: ActivatedRoute;
  private readonly contaService: ContaService;
  private readonly clienteService: ClienteService;
  private readonly formGroup: ContaFormGroup;
  private readonly editar: Box<boolean>;

  constructor(
    router: Router,
    route: ActivatedRoute,
    contaService: ContaService,
    clienteService: ClienteService
  ) {
    this.router = router;
    this.route = route;
    this.contaService = contaService;
    this.clienteService = clienteService;
    this.formGroup = new FormGroup({
      id: new FormControl(
        0,
        { nonNullable: true }
      ),
      cliente: new FormControl(
        0,
        { nonNullable: true, validators: [Validators.required] }
      ),
      numero: new FormControl(
        '',
        { nonNullable: true, validators: [Validators.required] }
      ),
      agencia: new FormControl(
        '',
        { nonNullable: true, validators: [Validators.required] }
      ),
      saldo: new FormControl(
        '',
        { nonNullable: true, validators: [Validators.required] }
      )
    });
    this.editar = new BoxOf<boolean>(false);
  }

  ngOnInit(): void {
    const param = this.route.snapshot.params["id"];
    if (param) {
      this.editar.store(true);
      this.contaService.pesquisePorId(param).subscribe(
        conta => {
          this.formGroup.patchValue(conta)
        }
      );
    }
  }

  form(): FormGroup {
    return this.formGroup;
  }

  clientes(): Paginated<Cliente> {
    return this.clienteService;
  }

  onClienteSelecionado(cliente: Cliente): void {
    this.formGroup.get('cliente')?.setValue(cliente.id);
  }

  cadastre() {
    const conta = new ContaDe(this.formGroup.getRawValue());
    if (this.editar.value()) {
      this.contaService.atualize(conta).subscribe({
        next: () => {
          new SuccessMessage(
            'Sucesso',
            'Conta atualizada com sucesso!'
          ).show();
          this.router.navigate(['/conta']);
        },
        error: (error: HttpErrorResponse) => {
          new ErrorMessage(
            'Oops...',
            'Erro ao atualizar a conta!',
            new ErrorReasons(error)
          ).show();
        }
      });
    } else {
      this.contaService.insere(conta).subscribe({
        next: () => {
          new SuccessMessage(
            'Sucesso',
            'Conta cadastrada com sucesso!'
          ).show();
          this.router.navigate(['/conta']);
        },
        error: (error: HttpErrorResponse) => {
          new ErrorMessage(
            'Oops...',
            'Erro ao cadastrar a conta!',
            new ErrorReasons(error)
          ).show();
        }
      });
    }
  }
}

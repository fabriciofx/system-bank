import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContaService } from '../../../shared/services/conta/conta-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { Conta } from '../../../shared/models/conta';
import { InfiniteSelect } from "../../../shared/components/infinite-select/infinite-select";
import { Box, BoxOf } from '../../../shared/custom/box';
import { ErrorMessage, SuccessMessage } from '../../../shared/custom/message';
import { ErrorReasons } from '../../../shared/custom/error-reasons';
import { Paginated } from '../../../shared/custom/paginated';
import { ClienteService } from '../../../shared/services/cliente/cliente-service';
import { Cliente } from '../../../shared/models/cliente';

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
  private readonly clienteService: ClienteService;
  private readonly formGroup: FormGroup;
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
      id: new FormControl(null),
      cliente: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
      agencia: new FormControl('', Validators.required),
      saldo: new FormControl('', Validators.required)
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

  onClienteSelecionado(value: any): void {
    const cliente = value as Cliente;
    this.formGroup.get('cliente')?.setValue(cliente.id);
  }

  cadastre() {
    const conta: Conta = this.formGroup.value;
    if (this.editar.value()) {
      this.contaService.atualize(conta).subscribe({
        next: () => {
          new SuccessMessage(
            'Sucesso',
            'Conta atualizada com sucesso!'
          ).show();
          this.router.navigate(['/conta']);
        },
        error: (error) => {
          console.error(error);
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
        error: (error) => {
          console.error(error);
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

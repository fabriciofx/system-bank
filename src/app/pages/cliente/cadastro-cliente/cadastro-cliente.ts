import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { ClienteService } from '../../../shared/services/cliente/cliente-service';
import { ClienteDe } from '../../../shared/models/cliente';
import { ErrorReasons } from '../../../shared/core/error-reasons';
import { SuccessMessage, ErrorMessage } from '../../../shared/components/message/message';
import { Box, BoxOf } from '../../../shared/core/box';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';

type ClienteFormGroup = FormGroup<{
  id: FormControl<number>;
  nome: FormControl<string>;
  cpf: FormControl<string>;
  email: FormControl<string>;
  senha: FormControl<string>
  observacoes: FormControl<string>;
  ativo: FormControl<boolean>
}>;

@Component({
  selector: 'app-cadastro-cliente',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './cadastro-cliente.html',
  styleUrl: './cadastro-cliente.scss'
})
export class CadastroCliente implements OnInit {
  private readonly router: Router;
  private readonly route: ActivatedRoute;
  private readonly clienteService: ClienteService;
  private readonly formGroup: ClienteFormGroup;
  private readonly editar: Box<boolean>;

  constructor(
    router: Router,
    route: ActivatedRoute,
    clienteService: ClienteService
  ) {
    this.router = router;
    this.route = route;
    this.clienteService = clienteService;
    this.formGroup = new FormGroup({
      id: new FormControl(
        0,
        { nonNullable: true }
      ),
      nome: new FormControl(
        '',
        { nonNullable: true, validators: [Validators.required] }
      ),
      cpf: new FormControl(
        '',
        { nonNullable: true, validators: [Validators.required] }
      ),
      email: new FormControl(
        '',
        {
          nonNullable: true,
          validators: [Validators.required, Validators.email]
        }
      ),
      senha: new FormControl(
        '',
        { nonNullable: true }
      ),
      observacoes: new FormControl(
        '',
        { nonNullable: true, validators: [Validators.required] }
      ),
      ativo: new FormControl(true, { nonNullable: true })
    });
    this.editar = new BoxOf<boolean>(false);
  }

  ngOnInit(): void {
    const param = this.route.snapshot.params["id"];
    if (param) {
      this.editar.store(true);
      this.clienteService.pesquisePorId(param).subscribe(
        cliente => {
          this.formGroup.patchValue(cliente);
        }
      );
    }
  }

  form(): FormGroup {
    return this.formGroup;
  }

  cadastre() {
    const cliente = new ClienteDe(this.formGroup.getRawValue());
    if (this.editar.value()) {
      this.clienteService.atualize(cliente).subscribe({
        next: () => {
          new SuccessMessage(
            'Sucesso!',
            'Cliente cadastrado com sucesso!'
          ).show();
          this.router.navigate(['/cliente']);
        },
        error: (error: HttpErrorResponse) => {
          new ErrorMessage(
            'Oops...',
            'Erro ao atualizar o cliente!',
            new ErrorReasons(error)
          ).show();
        }
      });
    } else {
      this.clienteService.insere(cliente).subscribe({
        next: () => {
          new SuccessMessage(
            'Sucesso!',
            'Cliente cadastrado com sucesso!'
          ).show();
          this.router.navigate(['/cliente']);
        },
        error: (error: HttpErrorResponse) => {
          new ErrorMessage(
            'Oops...',
            'Erro ao cadastrar o cliente!',
            new ErrorReasons(error)
          ).show();
        }
      });
    }
  }
}

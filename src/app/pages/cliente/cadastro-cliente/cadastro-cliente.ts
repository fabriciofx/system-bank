import { Component } from '@angular/core';
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
import { Cliente } from '../../../shared/models/cliente';
import { ErrorReasons } from '../../../shared/custom/error-reasons';
import { SuccessMessage, ErrorMessage } from '../../../shared/custom/message';
import { Box, BoxOf } from '../../../shared/custom/box';

@Component({
  selector: 'app-cadastro-cliente',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './cadastro-cliente.html',
  styleUrl: './cadastro-cliente.scss'
})
export class CadastroCliente {
  private readonly router: Router;
  private readonly route: ActivatedRoute;
  private readonly clienteService: ClienteService;
  private readonly formGroup: FormGroup;
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
      id: new FormControl(null),
      nome: new FormControl('', Validators.required),
      cpf: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      observacoes: new FormControl('', Validators.required),
      ativo: new FormControl(true)
    });
    this.editar = new BoxOf<boolean>(false);
  }

  ngOnInit(): void {
    const param = this.route.snapshot.params["id"];
    if (param) {
      this.editar.store(true);
      this.clienteService.pesquisePorId(param).subscribe(
        cliente => {
          this.formGroup.patchValue(cliente)
        }
      );
    }
  }

  form(): FormGroup {
    return this.formGroup;
  }

  cadastre() {
    const cliente: Cliente = this.formGroup.value;
    if (this.editar.value()) {
      this.clienteService.atualize(cliente).subscribe({
        next: () => {
          new SuccessMessage(
            'Sucesso!',
            'Cliente cadastrado com sucesso!'
          ).show();
          this.router.navigate(['/cliente']);
        },
        error: (error) => {
          console.error(error);
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
        error: (error) => {
          console.error(error);
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

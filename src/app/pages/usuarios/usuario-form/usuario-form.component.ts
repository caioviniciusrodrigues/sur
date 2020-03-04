import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';


import { Usuario } from './../shared/usuario';
import { UsuarioService } from '../shared/usuario.service';


@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  usuarioForm: FormGroup;
  pageTitle: string;
  erros: string[] = [];
  submitted = false;
  usuario: Usuario = new Usuario();


  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submitted = true;

    if(this.currentAction == 'new') {
      this.createUser();
    } else {
      console.log('UPDATE');
      this.updateUsuario();
    }
  }

  private createUser() {
    //Recupera os valores do form e popula um novo objeto usuário
    const usuario: Usuario = Object.assign(new Usuario(), this.usuarioForm.value);
    this.usuarioService.create(usuario).subscribe(
      (usuario: Usuario) => this.actionsForSuccess(usuario),
      (error) => this.actionsForError(error)
    );
  }

  private updateUsuario() {
    const usuario: Usuario = Object.assign(new Usuario(), this.usuarioForm.value);
    this.usuarioService.update(usuario).subscribe(
      (usuario: Usuario) => this.actionsForSuccess(usuario),
      (error) => this.actionsForError(error)
    );
  }

  private actionsForSuccess(usuario: Usuario) {
    alert('Solicitação processada com sucesso');

    //redirect
    this.router.navigateByUrl('usuarios', {skipLocationChange: true} ).then(
      () => this.router.navigate(['usuarios', usuario.id, 'edit'])
    );
  }

  private actionsForError(error) {
    alert('Ocorreu um erro ao processar sua solicitação');

    this.submitted = false;

    if(error.status == 422) {
      this.erros = JSON.parse(error._body).errors;
    } else {
      this.erros = ['Houve falha de comunicação com o servidor!'];
    }

  }

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildUsuarioForm();
    this.loadUsuario();
  }

//  PRIVATE METHODS

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildUsuarioForm() {
    this.usuarioForm = this.fb.group({
      id: [null],
      nome: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      login: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(4)])]
    });
  }

  private loadUsuario() {
    if(this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.usuarioService.getById(+params.get('id')))
      )
      .subscribe(
        (usuario) => {
          this.usuario = usuario;
          this.usuarioForm.patchValue(usuario);
        },
        () => console.log('error')
      );
    }
  }

  private setPageTitle() {
    if(this.currentAction == 'new') {
      this.pageTitle = 'Novo usuário';
    } else {
      const nomeUsuario = this.usuario.nome || '';
      this.pageTitle = 'Editando usuário: ' + nomeUsuario;
    }
  }

}

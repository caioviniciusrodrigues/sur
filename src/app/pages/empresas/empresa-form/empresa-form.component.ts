import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';


import { Empresa } from '../shared/empresa.model';
import { EmpresaService } from '../shared/empresa.service';


@Component({
  selector: 'app-empresa-form',
  templateUrl: './empresa-form.component.html',
  styleUrls: ['./empresa-form.component.css']
})
export class EmpresaFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  empresaForm: FormGroup;
  pageTitle: string;
  erros: string[] = [];
  submitted = false;
  empresa: Empresa = new Empresa();


  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submitted = true;

    if(this.currentAction == 'new') {
      this.createUser();
    } else {
      console.log('UPDATE');
      this.updateempresa();
    }
  }

  private createUser() {
    //Recupera os valores do form e popula um novo objeto usuário
    const empresa: Empresa = Object.assign(new Empresa(), this.empresaForm.value);
    this.empresaService.create(empresa).subscribe(
      (empresa: Empresa) => this.actionsForSuccess(empresa),
      (error) => this.actionsForError(error)
    );
  }

  private updateempresa() {
    const empresa: Empresa = Object.assign(new Empresa(), this.empresaForm.value);
    this.empresaService.update(empresa).subscribe(
      (empresa: Empresa) => this.actionsForSuccess(empresa),
      (error) => this.actionsForError(error)
    );
  }

  private actionsForSuccess(empresa: Empresa) {
    alert('Solicitação processada com sucesso');

    //redirect
    this.router.navigateByUrl('empresas', {skipLocationChange: true} ).then(
      () => this.router.navigate(['empresas', empresa.id, 'edit'])
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
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildempresaForm();
    this.loadempresa();
  }

//  PRIVATE METHODS

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildempresaForm() {
    this.empresaForm = this.fb.group({
      id: [null],
      nome: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      login: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(4)])]
    });
  }

  private loadempresa() {
    if(this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.empresaService.getById(+params.get('id')))
      )
      .subscribe(
        (empresa) => {
          this.empresa = empresa;
          this.empresaForm.patchValue(empresa);
        },
        () => console.log('error')
      );
    }
  }

  private setPageTitle() {
    if(this.currentAction == 'new') {
      this.pageTitle = 'Nova Empresa';
    } else {
      const nomeEmpresa = this.empresa.razaosocial || '';
      this.pageTitle = 'Editando usuário: ' + nomeEmpresa;
    }
  }

}

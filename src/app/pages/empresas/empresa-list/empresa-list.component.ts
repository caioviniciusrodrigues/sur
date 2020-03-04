import { Component, OnInit } from '@angular/core';
import { Empresa } from '../shared/empresa.model';
import { EmpresaService } from '../shared/empresa.service';

@Component({
  selector: 'app-empresa-list',
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.css'],
  preserveWhitespaces: true
})
export class EmpresaListComponent implements OnInit {

  empresas: Empresa[] = [];

  constructor(private serviceEmpresa: EmpresaService) { }

  ngOnInit() {
    this.serviceEmpresa.list().subscribe(
      dados => this.empresas = dados,
      error => console.log(error)
    );
  }

  delete(empresa: Empresa) {
    const confirmacao = confirm('Confirma exclusão da empresa?');
    if(confirmacao) {
      this.serviceEmpresa.delete(empresa.id).subscribe(
        //refaz a consulta retirando o elemento excluido
        () => this.empresas = this.empresas.filter(element => element != empresa),
        () => alert('Erro ao excluir'),
        () => console.log('concluido')
      );
    }
  }

}

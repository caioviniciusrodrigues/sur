import { Component, OnInit } from '@angular/core';
import { Usuario } from '../shared/usuario';
import { UsuarioService } from '../shared/usuario.service';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css'],
  preserveWhitespaces: true
})
export class UsuarioListComponent implements OnInit {

  usuarios: Usuario[] = [];

  constructor(private serviceUsuario: UsuarioService) { }

  ngOnInit() {
    this.serviceUsuario.list().subscribe(
      dados => this.usuarios = dados,
      error => console.log(error)
    );
  }

  delete(usuario: Usuario) {
    const confirmacao = confirm('Confirma exclusão do usuário?');
    if(confirmacao) {
      this.serviceUsuario.delete(usuario.id).subscribe(
        //refaz a consulta retirando o elemento excluido
        () => this.usuarios = this.usuarios.filter(element => element != usuario),
        () => alert('Erro ao excluir'),
        () => console.log('concluido')
      );
    }
  }

}

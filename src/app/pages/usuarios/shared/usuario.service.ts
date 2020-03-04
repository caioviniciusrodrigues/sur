import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Usuario } from './usuario';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly API = `${environment.API}usuarios`;

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Usuario[]>(this.API).pipe(
      tap(console.log)
    );
  }

  create(usuario: Usuario) {
    return this.http.post(this.API, usuario).pipe(take(1));
  }

  update(usuario: Usuario) {
    return this.http.put(this.API + '/' + usuario.id, usuario).pipe(take(1));
  }

  delete(id: number) {
    return this.http.delete(this.API + '/' + id);
  }

  getById(id: number) {
    return this.http.get<Usuario>(this.API + '/' + id);
  }

}

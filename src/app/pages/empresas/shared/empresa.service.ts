import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Empresa } from './empresa.model';
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private readonly API = `${environment.API}Empresas`;

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Empresa[]>(this.API).pipe(
      tap(console.log)
    );
  }

  create(empresa: Empresa) {
    return this.http.post(this.API, empresa).pipe(take(1));
  }

  update(empresa: Empresa) {
    return this.http.put(this.API + '/' + empresa.id, empresa).pipe(take(1));
  }

  delete(id: number) {
    return this.http.delete(this.API + '/' + id);
  }

  getById(id: number) {
    return this.http.get<Empresa>(this.API + '/' + id);
  }

}

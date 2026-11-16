
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl = 'https://potential-space-fiesta-gx6w99g4pxpqf9g9-3000.app.github.dev/clientes';

  constructor(private http: HttpClient) {}

  listarClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  cadastrarCliente(cliente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cliente);
  }

  atualizarCliente(id: number, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, cliente);
  }

  excluirCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

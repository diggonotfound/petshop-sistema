import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {

  private apiUrl = 'https://petshop-backend-ebv2.onrender.com/servicos';

  constructor(private http: HttpClient) {}

  listarServicos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  cadastrarServico(servico: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, servico);
  }

  atualizarServico(id: number, servico: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, servico);
  }

  excluirServico(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
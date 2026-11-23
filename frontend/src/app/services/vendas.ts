import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendasService {

  private apiUrl = 'https://petshop-backend-ebv2.onrender.com/vendas';

  constructor(private http: HttpClient) {}

  listarVendas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  cadastrarVenda(venda: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, venda);
  }

  buscarVendaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
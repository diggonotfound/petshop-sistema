import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendasService {

  private apiUrl = 'https://potential-space-fiesta-gx6w99g4pxpqf9g9-3000.app.github.dev/vendas';

  constructor(private http: HttpClient) {}

  listarVendas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  cadastrarVenda(venda: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, venda);
  }
}
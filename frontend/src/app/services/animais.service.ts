import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimaisService {

  private apiUrl = 'https://potential-space-fiesta-gx6w99g4pxpqf9g9-3000.app.github.dev/animais';

  constructor(private http: HttpClient) {}

  listarAnimais(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  cadastrarAnimal(animal: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, animal);
  }

  atualizarAnimal(id: number, animal: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, animal);
  }

  excluirAnimal(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
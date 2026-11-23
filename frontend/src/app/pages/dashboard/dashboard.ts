
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {

  clientes = 0;
  animais = 0;
  produtos = 0;
  vendas = 0;

  carregando = true;
  mensagemErro = '';

  private apiUrl = 'https://potential-space-fiesta-gx6w99g4pxpqf9g9-3000.app.github.dev/dashboard';

  constructor(
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarResumo();
  }

  carregarResumo(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: dados => {
        this.clientes = Number(dados.clientes) || 0;
        this.animais = Number(dados.animais) || 0;
        this.produtos = Number(dados.produtos) || 0;
        this.vendas = Number(dados.vendas) || 0;

        this.carregando = false;
        this.cd.detectChanges();
      },
      error: erro => {
        console.error('Erro ao carregar Dashboard:', erro);
        this.mensagemErro = 'Não foi possível carregar os dados do Dashboard.';
        this.carregando = false;
        this.cd.detectChanges();
      }
    });
  }
}
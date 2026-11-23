
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ServicosService } from '../../services/servicos';

@Component({
  selector: 'app-servicos',
  standalone: false,
  templateUrl: './servicos.html',
  styleUrl: './servicos.scss'
})
export class Servicos implements OnInit {

  listaServicos: any[] = [];

  mostrarFormulario = false;
  mensagem = '';
  indiceEmEdicao: number | null = null;

  servico = {
    nome: '',
    descricao: '',
    preco: 0,
    duracao_minutos: 30
  };

  constructor(
    private servicosService: ServicosService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarServicos();
  }

  carregarServicos(): void {
    this.servicosService.listarServicos().subscribe({
      next: (dados) => {
        this.listaServicos = dados;
        this.cd.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar serviços:', erro);
        this.mensagem = 'Erro ao carregar serviços.';
        this.cd.detectChanges();
      }
    });
  }

  abrirFormulario(): void {
    this.limparFormulario();
    this.mostrarFormulario = true;
  }

  salvarServico(): void {
    if (!this.servico.nome.trim() || this.servico.preco < 0) {
      this.mensagem = 'Preencha o nome e informe um preço válido.';
      return;
    }

    const operacao = this.indiceEmEdicao !== null
      ? this.servicosService.atualizarServico(this.indiceEmEdicao, this.servico)
      : this.servicosService.cadastrarServico(this.servico);

    operacao.subscribe({
      next: () => {
        this.mensagem = this.indiceEmEdicao !== null
          ? 'Serviço atualizado com sucesso!'
          : 'Serviço cadastrado com sucesso!';

        this.carregarServicos();
        this.cancelarFormulario();
      },
      error: (erro) => {
        console.error('Erro ao salvar serviço:', erro);
        this.mensagem = 'Erro ao salvar serviço.';
        this.cd.detectChanges();
      }
    });
  }

  editarServico(servico: any): void {
    this.indiceEmEdicao = servico.id;

    this.servico = {
      nome: servico.nome,
      descricao: servico.descricao || '',
      preco: Number(servico.preco),
      duracao_minutos: Number(servico.duracao_minutos)
    };

    this.mostrarFormulario = true;
  }

  excluirServico(id: number): void {
    if (!confirm('Deseja realmente excluir este serviço?')) {
      return;
    }

    this.servicosService.excluirServico(id).subscribe({
      next: () => {
        this.mensagem = 'Serviço excluído com sucesso!';
        this.carregarServicos();
      },
      error: (erro) => {
        console.error('Erro ao excluir serviço:', erro);
        this.mensagem = 'Erro ao excluir serviço.';
        this.cd.detectChanges();
      }
    });
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.limparFormulario();
  }

  limparFormulario(): void {
    this.indiceEmEdicao = null;

    this.servico = {
      nome: '',
      descricao: '',
      preco: 0,
      duracao_minutos: 30
    };
  }
}
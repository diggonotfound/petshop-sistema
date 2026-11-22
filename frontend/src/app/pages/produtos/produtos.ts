import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProdutosService  } from '../../services/produtos';

@Component({
  selector: 'app-produtos',
  standalone: false,
  templateUrl: './produtos.html',
  styleUrl: './produtos.scss'
})
export class Produtos implements OnInit {

  listaProdutos: any[] = [];

  mostrarFormulario = false;
  mensagem = '';
  indiceEmEdicao: number | null = null;

  produto = {
    nome: '',
    categoria: '',
    descricao: '',
    preco_compra: 0,
    preco_venda: 0,
    estoque: 0,
    estoque_minimo: 0
  };

  constructor(
    private produtosService: ProdutosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.produtosService.listarProdutos().subscribe({
      next: (dados) => {
        this.listaProdutos = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar produtos:', erro);
        this.mensagem = 'Erro ao carregar produtos.';
      }
    });
  }

  abrirFormulario(): void {
    this.limparFormulario();
    this.mostrarFormulario = true;
  }

  salvarProduto(): void {
    if (
      !this.produto.nome.trim() ||
      !this.produto.categoria.trim()
    ) {
      this.mensagem = 'Preencha o nome e a categoria do produto.';
      return;
    }

    const operacao = this.indiceEmEdicao === null
      ? this.produtosService.cadastrarProduto(this.produto)
      : this.produtosService.atualizarProduto(this.indiceEmEdicao, this.produto);

    operacao.subscribe({
      next: () => {
        this.mensagem = this.indiceEmEdicao === null
          ? 'Produto cadastrado com sucesso!'
          : 'Produto atualizado com sucesso!';

        this.carregarProdutos();
        this.limparFormulario();
        this.mostrarFormulario = false;
      },
      error: (erro) => {
        console.error('Erro ao salvar produto:', erro);
        this.mensagem = 'Erro ao salvar produto.';
      }
    });
  }

  editarProduto(produto: any): void {
    this.produto = {
      nome: produto.nome,
      categoria: produto.categoria,
      descricao: produto.descricao || '',
      preco_compra: Number(produto.preco_compra),
      preco_venda: Number(produto.preco_venda),
      estoque: Number(produto.estoque),
      estoque_minimo: Number(produto.estoque_minimo)
    };

    this.indiceEmEdicao = produto.id;
    this.mostrarFormulario = true;
    this.mensagem = '';
  }

  excluirProduto(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    this.produtosService.excluirProduto(id).subscribe({
      next: () => {
        this.mensagem = 'Produto excluído com sucesso!';
        this.carregarProdutos();
      },
      error: (erro) => {
        console.error('Erro ao excluir produto:', erro);
        this.mensagem = 'Erro ao excluir produto.';
      }
    });
  }

  limparFormulario(): void {
    this.produto = {
      nome: '',
      categoria: '',
      descricao: '',
      preco_compra: 0,
      preco_venda: 0,
      estoque: 0,
      estoque_minimo: 0
    };

    this.indiceEmEdicao = null;
  }

  cancelarFormulario(): void {
    this.limparFormulario();
    this.mostrarFormulario = false;
    this.mensagem = '';
  }
}

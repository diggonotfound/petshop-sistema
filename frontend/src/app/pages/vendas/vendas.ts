
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VendasService } from '../../services/vendas';
import { ClientesService } from '../../services/clientes.service';
import { ProdutosService } from '../../services/produtos';
import { ServicosService } from '../../services/servicos';

@Component({
  selector: 'app-vendas',
  standalone: false,
  templateUrl: './vendas.html',
  styleUrl: './vendas.scss'
})
export class Vendas implements OnInit {

  listaVendas: any[] = [];
  listaClientes: any[] = [];
  listaProdutos: any[] = [];
  listaServicos: any[] = [];

  cliente_id: number | null = null;
  tipoItem: 'produto' | 'servico' = 'produto';
  item_id: number | null = null;
  quantidade = 1;

  itens: any[] = [];
  valorTotal = 0;

  mensagem = '';

  vendaSelecionada: any = null;
  carregandoDetalhes = false;

  constructor(
    private vendasService: VendasService,
    private clientesService: ClientesService,
    private produtosService: ProdutosService,
    private servicosService: ServicosService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.clientesService.listarClientes().subscribe({
      next: dados => {
        this.listaClientes = dados;
        this.cd.detectChanges();
      },
      error: erro => console.error('Erro ao carregar clientes:', erro)
    });

    this.produtosService.listarProdutos().subscribe({
      next: dados => {
        this.listaProdutos = dados;
        this.cd.detectChanges();
      },
      error: erro => console.error('Erro ao carregar produtos:', erro)
    });

    this.servicosService.listarServicos().subscribe({
      next: dados => {
        this.listaServicos = dados;
        this.cd.detectChanges();
      },
      error: erro => console.error('Erro ao carregar serviços:', erro)
    });

    this.carregarVendas();
  }

  carregarVendas(): void {
    this.vendasService.listarVendas().subscribe({
      next: dados => {
        this.listaVendas = dados;
        this.cd.detectChanges();
      },
      error: erro => console.error('Erro ao carregar vendas:', erro)
    });
  }

  adicionarItem(): void {
    if (!this.item_id || this.quantidade <= 0) {
      this.mensagem = 'Selecione um item e informe uma quantidade válida.';
      return;
    }

    const lista = this.tipoItem === 'produto'
      ? this.listaProdutos
      : this.listaServicos;

    const itemSelecionado = lista.find(
      item => item.id === Number(this.item_id)
    );

    if (!itemSelecionado) {
      this.mensagem = 'Item não encontrado.';
      return;
    }

    const preco = this.tipoItem === 'produto'
      ? Number(itemSelecionado.preco_venda)
      : Number(itemSelecionado.preco);

    if (this.tipoItem === 'produto' &&
        itemSelecionado.estoque < this.quantidade) {
      this.mensagem = 'Estoque insuficiente.';
      return;
    }

    const existente = this.itens.find(
      item => item.tipo === this.tipoItem &&
              item.item_id === Number(this.item_id)
    );

    if (existente) {
      const novaQuantidade = existente.quantidade + this.quantidade;

      if (this.tipoItem === 'produto' &&
          itemSelecionado.estoque < novaQuantidade) {
        this.mensagem = 'Estoque insuficiente para essa quantidade.';
        return;
      }

      existente.quantidade = novaQuantidade;
      existente.subtotal = existente.preco_unitario * novaQuantidade;

    } else {
      this.itens.push({
        tipo: this.tipoItem,
        item_id: Number(this.item_id),
        nome: itemSelecionado.nome,
        preco_unitario: preco,
        quantidade: this.quantidade,
        subtotal: preco * this.quantidade
      });
    }

    this.calcularTotal();
    this.item_id = null;
    this.quantidade = 1;
    this.mensagem = '';
  }

  removerItem(index: number): void {
    this.itens.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.valorTotal = this.itens.reduce(
      (total, item) => total + item.subtotal,
      0
    );
  }

  finalizarVenda(): void {
    if (!this.cliente_id) {
      this.mensagem = 'Selecione um cliente.';
      return;
    }

    if (this.itens.length === 0) {
      this.mensagem = 'Adicione pelo menos um produto ou serviço.';
      return;
    }

    const venda = {
      cliente_id: this.cliente_id,
      itens: this.itens.map(item => ({
        tipo: item.tipo,
        item_id: item.item_id,
        quantidade: item.quantidade
      }))
    };

    this.vendasService.cadastrarVenda(venda).subscribe({
      next: resposta => {
        this.mensagem = resposta.mensagem;
        this.cliente_id = null;
        this.itens = [];
        this.valorTotal = 0;
        this.carregarVendas();
        this.cd.detectChanges();
      },
      error: erro => {
        this.mensagem = erro.error?.mensagem || 'Erro ao registrar venda.';
        this.cd.detectChanges();
      }
    });
  }

  verDetalhesVenda(id: number): void {
    this.carregandoDetalhes = true;
    this.vendaSelecionada = null;

    this.vendasService.buscarVendaPorId(id).subscribe({
      next: venda => {
        this.vendaSelecionada = venda;
        this.carregandoDetalhes = false;
        this.cd.detectChanges();
      },
      error: erro => {
        this.mensagem = erro.error?.mensagem ||
          'Erro ao carregar detalhes da venda.';
        this.carregandoDetalhes = false;
        this.cd.detectChanges();
      }
    });
  }

  fecharDetalhesVenda(): void {
    this.vendaSelecionada = null;
  }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AnimaisService } from '../../services/animais.service';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-animais',
  standalone: false,
  templateUrl: './animais.html',
  styleUrl: './animais.scss'
})
export class Animais implements OnInit {

  listaAnimais: any[] = [];
  listaClientes: any[] = [];

  mostrarFormulario = false;
  mensagem = '';

  animal = {
    nome: '',
    especie: '',
    raca: '',
    sexo: '',
    data_nascimento: '',
    cliente_id: null as number | null
  };

  especies = [
    'Cachorro',
    'Gato',
    'Macaco',
    'Coelho',
    'Pássaro',
    'Outro'
  ];

  racas: { [key: string]: string[] } = {
    Cachorro: ['Shih-tzu', 'Poodle', 'Labrador', 'Golden Retriever', 'Bulldog', 'SRD', 'Outra'],
    Gato: ['Persa', 'Siamês', 'Maine Coon', 'Angorá', 'SRD', 'Outra'],
    Macaco: ['Sagui', 'Macaco-prego', 'Mico-leão-dourado', 'Outro'],
    Coelho: ['Mini Lop', 'Lionhead', 'Rex', 'Angorá', 'Outra'],
    Pássaro: ['Calopsita', 'Periquito-australiano', 'Canário', 'Agapornis', 'Papagaio', 'Outro'],
    Outro: ['Não se aplica', 'Outra']
  };

  constructor(
    private animaisService: AnimaisService,
    private clientesService: ClientesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarAnimais();
    this.carregarClientes();
  }

  carregarAnimais(): void {
    this.animaisService.listarAnimais().subscribe({
      next: (animais) => {
        console.log('Animais recebidos:', animais);
        this.listaAnimais = animais;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar animais:', erro);
      }
    });
  }

  carregarClientes(): void {
    this.clientesService.listarClientes().subscribe({
      next: (clientes) => {
        console.log('Clientes recebidos:', clientes);
        this.listaClientes = clientes;
      },
      error: (erro) => {
        console.error('Erro ao carregar tutores:', erro);
      }
    });
  }

  selecionarEspecie(especie: string): void {
    this.animal.especie = especie;
    this.animal.raca = '';
  }

  abrirFormulario(): void {
    this.mostrarFormulario = true;
    this.mensagem = '';
  }

  limparFormulario(): void {
    this.animal = {
      nome: '',
      especie: '',
      raca: '',
      sexo: '',
      data_nascimento: '',
      cliente_id: null
    };

    this.mensagem = '';
  }

  salvarAnimal(): void {
    if (
      !this.animal.nome.trim() ||
      !this.animal.especie ||
      !this.animal.cliente_id
    ) {
      this.mensagem = 'Preencha o nome, a espécie e o tutor do animal.';
      return;
    }

    const dadosAnimal = {
      ...this.animal,
      data_nascimento: this.animal.data_nascimento || null
    };

    this.animaisService.cadastrarAnimal(dadosAnimal).subscribe({
      next: () => {
        this.mensagem = 'Animal cadastrado com sucesso!';
        this.carregarAnimais();
        this.limparFormulario();
        this.mostrarFormulario = false;
      },
      error: (erro) => {
        console.error('Erro ao cadastrar animal:', erro);
        this.mensagem = 'Não foi possível cadastrar o animal.';
      }
    });
  }

  excluirAnimal(id: number): void {
    const confirmar = confirm(
      'Tem certeza que deseja excluir este animal?'
    );

    if (confirmar) {
      this.animaisService.excluirAnimal(id).subscribe({
        next: () => {
          this.mensagem = 'Animal excluído com sucesso!';
          this.carregarAnimais();
        },
        error: (erro) => {
          console.error('Erro ao excluir animal:', erro);
          this.mensagem = 'Não foi possível excluir o animal.';
        }
      });
    }
  }

}

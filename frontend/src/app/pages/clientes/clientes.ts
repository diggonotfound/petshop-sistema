
import { Component } from '@angular/core';

interface Cliente {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
}

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class Clientes {

  nome = '';
  cpf = '';
  telefone = '';
  email = '';

  mensagem = '';

  listaClientes: Cliente[] = [];

  cadastrarCliente() {

    if (
      !this.nome.trim() ||
      !this.cpf.trim() ||
      !this.telefone.trim() ||
      !this.email.trim()
    ) {
      this.mensagem = 'Preencha todos os campos!';
      return;
    }

    const novoCliente: Cliente = {
      nome: this.nome.trim(),
      cpf: this.cpf.trim(),
      telefone: this.telefone.trim(),
      email: this.email.trim()
    };

    this.listaClientes.push(novoCliente);

    this.mensagem = 'Cliente cadastrado com sucesso!';

    this.nome = '';
    this.cpf = '';
    this.telefone = '';
    this.email = '';
  }
}

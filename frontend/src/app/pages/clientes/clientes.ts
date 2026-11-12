
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
  
  indiceEmEdicao: number | null = null;

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

  const cliente: Cliente = {
    nome: this.nome.trim(),
    cpf: this.cpf.trim(),
    telefone: this.telefone.trim(),
    email: this.email.trim()
  };

  if (this.indiceEmEdicao !== null) {
    this.listaClientes[this.indiceEmEdicao] = cliente;
    this.mensagem = 'Cliente atualizado com sucesso!';
    this.indiceEmEdicao = null;
  } else {
    this.listaClientes.push(cliente);
    this.mensagem = 'Cliente cadastrado com sucesso!';
  }

  this.limparFormulario();
}

editarCliente(index: number) {
  const cliente = this.listaClientes[index];

  this.nome = cliente.nome;
  this.cpf = cliente.cpf;
  this.telefone = cliente.telefone;
  this.email = cliente.email;

  this.indiceEmEdicao = index;
  this.mensagem = 'Altere os dados e clique em Atualizar cliente.';
}

limparFormulario() {
  this.nome = '';
  this.cpf = '';
  this.telefone = '';
  this.email = '';
  }
}
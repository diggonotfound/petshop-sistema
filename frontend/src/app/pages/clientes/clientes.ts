
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

  listaClientes: Cliente[] = JSON.parse(
  localStorage.getItem('clientes') || '[]'
);

validarNome(): boolean {
  return /^[\p{L}\s]+$/u.test(this.nome.trim()) &&
         this.nome.trim().length >= 2;
}

validarCPF(): boolean {
  const cpf = this.cpf.replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }

  let resto = (soma * 10) % 11;
  let digito1 = resto === 10 ? 0 : resto;

  if (digito1 !== Number(cpf[9])) {
    return false;
  }

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }

  resto = (soma * 10) % 11;
  let digito2 = resto === 10 ? 0 : resto;

  return digito2 === Number(cpf[10]);
}

validarTelefone(): boolean {
  const telefone = this.telefone.replace(/\D/g, '');

  return telefone.length === 10 || telefone.length === 11;
}

validarEmail(): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim());
}

  
  
indiceEmEdicao: number | null = null;

termoBusca = '';

get clientesFiltrados(): Cliente[] {
  const termo = this.termoBusca.toLowerCase().trim();

  return this.listaClientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(termo) ||
    cliente.cpf.includes(termo)
  );
}

salvarClientes() {
  localStorage.setItem(
    'clientes',
    JSON.stringify(this.listaClientes)
  );
}
 

  formatarCPF() {
  let cpf = this.cpf.replace(/\D/g, '');

  cpf = cpf.substring(0, 11);

  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  this.cpf = cpf;
}

formatarTelefone() {
  let telefone = this.telefone.replace(/\D/g, '');

  telefone = telefone.substring(0, 11);

  if (telefone.length <= 10) {
    telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
    telefone = telefone.replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
    telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');
  }

  this.telefone = telefone;
}
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

  if (!this.validarNome()) {
    this.mensagem = 'Digite um nome válido, usando apenas letras.';
    return;
  }

  if (!this.validarCPF()) {
    this.mensagem = 'Digite um CPF válido.';
    return;
  }

  if (!this.validarTelefone()) {
    this.mensagem = 'Digite um telefone com 10 ou 11 números.';
    return;
  }

  if (!this.validarEmail()) {
    this.mensagem = 'Digite um e-mail válido.';
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

  this.salvarClientes();

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

excluirCliente(index: number) {
  const confirmar = confirm(
    'Tem certeza que deseja excluir este cliente?'
  );

  if (confirmar) {
    this.listaClientes.splice(index, 1);
    this.mensagem = 'Cliente excluído com sucesso!';

    this.salvarClientes();

    if (this.indiceEmEdicao === index) {
      this.indiceEmEdicao = null;
      this.limparFormulario();
    }
  }
}

limparFormulario() {
  this.nome = '';
  this.cpf = '';
  this.telefone = '';
  this.email = '';
  }
}
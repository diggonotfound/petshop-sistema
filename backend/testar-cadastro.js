const axios = require('axios');

async function testarCadastro() {
    try {
        const resposta = await axios.post(
            'http://localhost:3000/clientes',
            {
                nome: 'Maria Silva',
                cpf: '123.456.789-09',
                telefone: '(14) 99999-9999',
                email: 'maria@email.com'
            }
        );

        console.log(resposta.data);

    } catch (erro) {
        console.log('Erro:', erro.response?.data || erro.message);
    }
}

testarCadastro();
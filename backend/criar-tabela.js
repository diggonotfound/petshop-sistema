
const mysql = require('mysql2/promise');
require('dotenv').config();

async function criarTabela() {
    let conexao;

    try {
        conexao = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: {}
        });

        await conexao.query(`
            CREATE TABLE IF NOT EXISTS clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                cpf VARCHAR(14) NOT NULL UNIQUE,
                telefone VARCHAR(20) NOT NULL,
                email VARCHAR(100) NOT NULL
            )
        `);

        console.log('Tabela clientes criada com sucesso!');
        
        await conexao.query(`
            CREATE TABLE IF NOT EXISTS animais (
                id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            especie VARCHAR(50) NOT NULL,
            raca VARCHAR(100),
            sexo VARCHAR(20),
            data_nascimento DATE,
            cliente_id INT NOT NULL,
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        )
`   );

console.log('Tabela animais criada com sucesso!');

    } catch (erro) {
        console.error('Erro ao criar tabela:', erro.message);

    } finally {
        if (conexao) {
            await conexao.end();
        }
    }
}

criarTabela();

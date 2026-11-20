
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {}
});

app.get('/', (req, res) => {
    res.send('API do Petshop funcionando!');
});

app.get('/clientes', async (req, res) => {
    try {
        const [clientes] = await db.query(
            'SELECT * FROM clientes ORDER BY id DESC'
        );

        res.json(clientes);

    } catch (erro) {
        console.error('Erro ao buscar clientes:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao buscar clientes.'
        });
    }
});

app.get('/animais', async (req, res) => {
    try {
        const [animais] = await db.query(`
            SELECT animais.*, clientes.nome AS nome_cliente
            FROM animais
            INNER JOIN clientes ON animais.cliente_id = clientes.id
            ORDER BY animais.id DESC
        `);

        res.json(animais);

    } catch (erro) {
        console.error('Erro ao buscar animais:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao buscar animais.'
        });
    }
});

app.post('/animais', async (req, res) => {
    try {
        const {
            nome,
            especie,
            raca,
            sexo,
            data_nascimento,
            cliente_id
        } = req.body;

        const [resultado] = await db.query(
            `INSERT INTO animais
            (nome, especie, raca, sexo, data_nascimento, cliente_id)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [nome, especie, raca, sexo, data_nascimento, cliente_id]
        );

        res.status(201).json({
            mensagem: 'Animal cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error('Erro ao cadastrar animal:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao cadastrar animal.'
        });
    }
});

app.put('/animais/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nome,
            especie,
            raca,
            sexo,
            data_nascimento,
            cliente_id
        } = req.body;

        const [resultado] = await db.query(
            `UPDATE animais
            SET nome = ?, especie = ?, raca = ?, sexo = ?,
            data_nascimento = ?, cliente_id = ?
            WHERE id = ?`,
            [nome, especie, raca, sexo, data_nascimento, cliente_id, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Animal não encontrado.'
            });
        }

        res.json({
            mensagem: 'Animal atualizado com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao atualizar animal:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao atualizar animal.'
        });
    }
});

app.delete('/animais/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.query(
            'DELETE FROM animais WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Animal não encontrado.'
            });
        }

        res.json({
            mensagem: 'Animal excluído com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao excluir animal:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao excluir animal.'
        });
    }
});

app.post('/clientes', async (req, res) => {
    try {
        const { nome, cpf, telefone, email } = req.body;

        const [resultado] = await db.query(
            'INSERT INTO clientes (nome, cpf, telefone, email) VALUES (?, ?, ?, ?)',
            [nome, cpf, telefone, email]
        );

        res.status(201).json({
            mensagem: 'Cliente cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error('Erro ao cadastrar cliente:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao cadastrar cliente.'
        });
    }
});

app.put('/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, cpf, telefone, email } = req.body;

        const [resultado] = await db.query(
            'UPDATE clientes SET nome = ?, cpf = ?, telefone = ?, email = ? WHERE id = ?',
            [nome, cpf, telefone, email, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Cliente não encontrado.'
            });
        }

        res.json({
            mensagem: 'Cliente atualizado com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao atualizar cliente:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao atualizar cliente.'
        });
    }
});

app.delete('/clientes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await db.query(
            'DELETE FROM clientes WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Cliente não encontrado.'
            });
        }

        res.json({
            mensagem: 'Cliente excluído com sucesso!'
        });

    } catch (erro) {
        console.error('Erro ao excluir cliente:', erro.message);
        res.status(500).json({
            mensagem: 'Erro ao excluir cliente.'
        });
    }
});

app.get('/teste-banco', async (req, res) => {
    try {
        const [resultado] = await db.query('SELECT 1 AS conectado');

        res.json({
            mensagem: 'Banco de dados conectado!',
            resultado
        });

    } catch (erro) {
        console.error('Erro ao conectar:', erro.message);
        res.status(500).json({
            mensagem: 'Não foi possível conectar ao banco.'
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
